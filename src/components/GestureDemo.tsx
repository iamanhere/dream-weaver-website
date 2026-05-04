import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, CameraOff, Hand, Volume2, Sun, MousePointer2 } from "lucide-react";

// MediaPipe Hands via CDN (loaded dynamically)
declare global {
  interface Window {
    Hands: any;
    drawConnectors: any;
    drawLandmarks: any;
    HAND_CONNECTIONS: any;
    Camera: any;
  }
}

const SCRIPTS = [
  "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
  "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
  "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

type FingerState = [boolean, boolean, boolean, boolean, boolean]; // thumb,index,middle,ring,pinky

function getFingerStates(landmarks: any[]): FingerState {
  // Thumb: compare tip x to ip x (works for right hand mirrored). Use distance heuristic.
  const thumb = Math.abs(landmarks[4].x - landmarks[17].x) > Math.abs(landmarks[3].x - landmarks[17].x);
  const index = landmarks[8].y < landmarks[6].y;
  const middle = landmarks[12].y < landmarks[10].y;
  const ring = landmarks[16].y < landmarks[14].y;
  const pinky = landmarks[20].y < landmarks[18].y;
  return [thumb, index, middle, ring, pinky];
}

function classifyGesture(f: FingerState): { name: string; action: string; key: string } | null {
  const [t, i, m, r, p] = f;
  if (i && !m && !r && !p) return { key: "cursor", name: "Index finger", action: "Move cursor" };
  if (t && i && m && r && p) return { key: "dblclick", name: "Open palm", action: "Double click" };
  if (!t && !i && !m && !r && !p) return { key: "close", name: "Closed fist", action: "Close window" };
  if (i && m && r && !p) return { key: "scrollDown", name: "Index+Middle+Ring", action: "Scroll down" };
  if (!i && m && r && p) return { key: "scrollUp", name: "Middle+Ring+Pinky", action: "Scroll up" };
  if (i && m && !r && !p) return { key: "volUp", name: "Index+Middle", action: "Volume up" };
  if (!i && !m && r && p) return { key: "volDown", name: "Ring+Pinky", action: "Volume down" };
  if (t && !i && !m && !r && p) return { key: "brightUp", name: "Thumb+Pinky", action: "Brightness up" };
  if (t && i && !m && !r && !p) return { key: "brightDown", name: "Thumb+Index", action: "Brightness down" };
  return null;
}

const GestureDemo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<any>(null);
  const handsRef = useRef<any>(null);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gesture, setGesture] = useState<string>("—");
  const [action, setAction] = useState<string>("—");
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [scroll, setScroll] = useState(50);
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [flash, setFlash] = useState<string | null>(null);

  const lastActionRef = useRef<{ key: string; t: number }>({ key: "", t: 0 });

  const onResults = useCallback((results: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const lm = results.multiHandLandmarks[0];
      if (window.drawConnectors && window.HAND_CONNECTIONS) {
        window.drawConnectors(ctx, lm, window.HAND_CONNECTIONS, { color: "#00FFFF", lineWidth: 2 });
        window.drawLandmarks(ctx, lm, { color: "#FF00AA", lineWidth: 1, radius: 3 });
      }

      const fingers = getFingerStates(lm);
      const g = classifyGesture(fingers);
      if (g) {
        setGesture(g.name);
        setAction(g.action);

        // Cursor follows index fingertip
        if (g.key === "cursor") {
          setCursor({ x: lm[8].x, y: lm[8].y });
        }

        // Throttle continuous actions (200ms) and one-shot actions (800ms)
        const now = performance.now();
        const continuous = ["scrollDown", "scrollUp", "volUp", "volDown", "brightUp", "brightDown"];
        const debounce = continuous.includes(g.key) ? 120 : 800;
        if (now - lastActionRef.current.t > debounce || lastActionRef.current.key !== g.key) {
          if (now - lastActionRef.current.t > debounce) {
            lastActionRef.current = { key: g.key, t: now };
            switch (g.key) {
              case "scrollDown": setScroll((s) => Math.min(100, s + 3)); break;
              case "scrollUp": setScroll((s) => Math.max(0, s - 3)); break;
              case "volUp": setVolume((v) => Math.min(100, v + 2)); break;
              case "volDown": setVolume((v) => Math.max(0, v - 2)); break;
              case "brightUp": setBrightness((b) => Math.min(100, b + 2)); break;
              case "brightDown": setBrightness((b) => Math.max(0, b - 2)); break;
              case "dblclick": setFlash("Double Click!"); setTimeout(() => setFlash(null), 600); break;
              case "close": setFlash("Close Window"); setTimeout(() => setFlash(null), 600); break;
            }
          }
        }
      } else {
        setGesture("Unknown");
        setAction("—");
      }
    } else {
      setGesture("No hand");
      setAction("—");
      setCursor(null);
    }
    ctx.restore();
  }, []);

  const start = async () => {
    setError(null);
    setLoading(true);
    try {
      for (const s of SCRIPTS) await loadScript(s);
      if (!window.Hands) throw new Error("MediaPipe failed to load");

      const hands = new window.Hands({
        locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(onResults);
      handsRef.current = hands;

      const video = videoRef.current!;
      const camera = new window.Camera(video, {
        onFrame: async () => {
          if (handsRef.current) await handsRef.current.send({ image: video });
        },
        width: 640,
        height: 480,
      });
      cameraRef.current = camera;
      await camera.start();
      setRunning(true);
    } catch (e: any) {
      setError(e?.message || "Failed to start camera");
    } finally {
      setLoading(false);
    }
  };

  const stop = () => {
    cameraRef.current?.stop?.();
    handsRef.current?.close?.();
    cameraRef.current = null;
    handsRef.current = null;
    setRunning(false);
    setGesture("—");
    setAction("—");
    setCursor(null);
    const v = videoRef.current;
    if (v && v.srcObject) {
      (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
  };

  useEffect(() => () => stop(), []);

  return (
    <section id="demo" className="py-24 container mx-auto">
      <div className="text-center mb-10">
        <Badge className="bg-primary/10 text-primary border border-primary/30 mb-3">
          <Hand className="w-3 h-3 mr-1" /> Live Browser Demo
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Try It <span className="text-gradient">Now</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Allow camera access and try the 9 gestures. Detection runs entirely in your browser using
          MediaPipe Hands — no data leaves your device.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video feed */}
        <Card className="lg:col-span-2 bg-gradient-card border-border overflow-hidden">
          <CardContent className="p-0 relative">
            <div className="relative aspect-video bg-black">
              <video ref={videoRef} className="hidden" playsInline />
              <canvas ref={canvasRef} className="w-full h-full object-cover scale-x-[-1]" />
              {cursor && (
                <div
                  className="absolute w-6 h-6 rounded-full bg-primary/80 border-2 border-primary shadow-elegant pointer-events-none transition-all duration-75"
                  style={{
                    left: `calc(${(1 - cursor.x) * 100}% - 12px)`,
                    top: `calc(${cursor.y * 100}% - 12px)`,
                    boxShadow: "0 0 20px hsl(var(--primary))",
                  }}
                />
              )}
              {flash && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl text-2xl font-bold animate-pulse">
                    {flash}
                  </div>
                </div>
              )}
              {!running && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground mb-4">Camera is off</p>
                    <Button
                      onClick={start}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-primary text-primary-foreground border-0 shadow-elegant"
                    >
                      {loading ? "Loading model..." : "Start Camera"}
                    </Button>
                    {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
                  </div>
                </div>
              )}
            </div>
            {running && (
              <div className="p-4 flex items-center justify-between border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live · MediaPipe Hands</span>
                </div>
                <Button onClick={stop} variant="outline" size="sm">
                  <CameraOff className="w-4 h-4 mr-2" /> Stop
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status panel */}
        <div className="space-y-4">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Detected Gesture</div>
              <div className="text-2xl font-bold text-gradient">{gesture}</div>
              <div className="text-sm text-accent mt-2 flex items-center gap-1">
                <MousePointer2 className="w-3 h-3" /> {action}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="flex items-center gap-1"><Volume2 className="w-3 h-3" /> Volume</span>
                  <span>{volume}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-primary transition-all" style={{ width: `${volume}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all" style={{ width: `${brightness}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Scroll Position</span>
                  <span>{scroll}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: `${scroll}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-5 text-xs text-muted-foreground space-y-1">
              <p className="text-foreground font-semibold mb-2">Tips</p>
              <p>• Good lighting, plain background</p>
              <p>• Keep hand 30–60 cm from camera</p>
              <p>• Hold gesture steady for ~0.5s</p>
              <p>• Browser-only — no data leaves device</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GestureDemo;
