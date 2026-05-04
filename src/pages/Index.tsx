import { Hand, MousePointer2, Maximize2, X, ArrowDown, ArrowUp, Volume2, VolumeX, Sun, SunDim, Camera, Cpu, Eye, Sparkles, Github, GraduationCap, Code2, Zap, ShieldCheck, Settings, Target, BarChart3, Terminal, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GestureDemo from "@/components/GestureDemo";

const gestures = [
  { icon: MousePointer2, name: "Index finger only", action: "Move mouse cursor" },
  { icon: Maximize2, name: "Open palm (all 5 fingers)", action: "Double click" },
  { icon: X, name: "Closed fist", action: "Close active window" },
  { icon: ArrowDown, name: "Index + Middle + Ring", action: "Scroll down" },
  { icon: ArrowUp, name: "Middle + Ring + Pinky", action: "Scroll up" },
  { icon: Volume2, name: "Index + Middle", action: "Increase volume" },
  { icon: VolumeX, name: "Ring + Pinky", action: "Decrease volume" },
  { icon: Sun, name: "Thumb + Pinky", action: "Increase brightness" },
  { icon: SunDim, name: "Thumb + Index", action: "Decrease brightness" },
];

const modules = [
  { icon: Camera, title: "Image Acquisition", desc: "Captures real-time webcam frames at smooth FPS for gesture detection." },
  { icon: Cpu, title: "Preprocessing", desc: "Resizing, noise reduction & normalization to enhance hand visibility." },
  { icon: Hand, title: "Hand Detection", desc: "MediaPipe-powered hand landmark detection isolating the hand region." },
  { icon: Eye, title: "Gesture Recognition", desc: "ML model classifies gestures and maps them to mouse actions." },
  { icon: MousePointer2, title: "Cursor Control", desc: "Translates fingertip coordinates into smooth cursor movement." },
];

const phase2 = [
  { icon: Sparkles, title: "Advanced Gestures", desc: "Multi-finger & dynamic gestures including drag-and-drop and zoom." },
  { icon: Zap, title: "Model Optimization", desc: "Lower latency, higher robustness against lighting & background noise." },
  { icon: Settings, title: "User Calibration", desc: "Personalize hand size, range and sensitivity per user." },
  { icon: ShieldCheck, title: "Error Handling", desc: "Validation logic to avoid false positives & unintended actions." },
  { icon: Target, title: "Lighting Adaptation", desc: "Consistent performance across resolutions and environments." },
  { icon: BarChart3, title: "Performance Eval", desc: "Accuracy, speed & responsiveness metrics with reports." },
];

const team = [
  { name: "Alok Singh", id: "MITU22BTCS0097" },
  { name: "Shravani Kale", id: "MITU23BTCSD105" },
  { name: "Pooja Borate", id: "MITU22BTCS0542" },
  { name: "Shubham Fargade", id: "MITU22BTCS0809" },
];

const codeSnippet = `import cv2
import mediapipe as mp
from pynput.mouse import Controller, Button
import pyautogui

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1,
                       min_detection_confidence=0.7)
mouse = Controller()
screen_w, screen_h = pyautogui.size()

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb)

    if result.multi_hand_landmarks:
        for hand in result.multi_hand_landmarks:
            # index fingertip → cursor
            x = int(hand.landmark[8].x * screen_w)
            y = int(hand.landmark[8].y * screen_h)
            mouse.position = (x, y)

            # detect finger states & trigger gestures
            # open palm → double click
            # fist → close window
            # index+middle → volume up ...`;

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Hand className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">GestureMouse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-primary transition">About</a>
            <a href="#gestures" className="hover:text-primary transition">Gestures</a>
            <a href="#modules" className="hover:text-primary transition">Modules</a>
            <a href="#code" className="hover:text-primary transition">Code</a>
            <a href="#team" className="hover:text-primary transition">Team</a>
          </div>
          <Badge variant="outline" className="border-primary/40 text-primary">MIT-ADT</Badge>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-32 pb-24 grid-bg">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15 mb-6">
              <Sparkles className="w-3 h-3 mr-1" /> Real-time ML · Touchless Computing
            </Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Gesture Controlled <span className="text-gradient">Mouse</span> Using Machine Learning
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A computer-vision project that lets you control your computer with hand gestures —
              cursor, clicks, scroll, volume, brightness and more, powered by MediaPipe & PyAutoGUI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground border-0 shadow-elegant hover:opacity-90">
                <a href="#gestures" className="flex items-center gap-2">Explore Gestures <Hand className="w-4 h-4" /></a>
              </Button>
              <Button size="lg" variant="outline" className="border-border">
                <a href="#code" className="flex items-center gap-2"><Code2 className="w-4 h-4" /> View Code</a>
              </Button>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { v: "9", l: "Gestures" },
                { v: "30+ FPS", l: "Realtime" },
                { v: "1 Cam", l: "Hardware" },
                { v: "100%", l: "Touchless" },
              ].map((s) => (
                <div key={s.l} className="bg-gradient-card border border-border rounded-xl p-5">
                  <div className="text-3xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* About / Problem */}
      <section id="about" className="py-24 container mx-auto">
        <div className="grid md:grid-cols-2 gap-10">
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-accent/40 text-accent">Problem</Badge>
              <CardTitle className="text-2xl mt-2">Why Touchless Matters</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              Traditional mice and touchpads require direct contact and aren't always convenient or
              accessible. In situations involving physical disabilities, hygiene concerns, limited
              workspace, or the need for touchless interaction, conventional input devices become
              impractical. Prolonged use also leads to repetitive strain injuries.
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <Badge variant="outline" className="w-fit border-primary/40 text-primary">Solution</Badge>
              <CardTitle className="text-2xl mt-2">Real-time Gesture Mouse</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              Our system uses a standard webcam, MediaPipe hand landmarks, and PyAutoGUI to perform
              cursor movement, double-click, window close, scrolling, screenshots, and volume /
              brightness control — all in real time using only your hand.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gestures */}
      <section id="gestures" className="py-24 bg-muted/20 border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge className="bg-accent/10 text-accent border border-accent/30 mb-3">Gesture Library</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">9 Integrated <span className="text-gradient">Gestures</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Each finger combination triggers a precise action, mapped through MediaPipe landmark detection.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gestures.map((g, i) => {
              const Icon = g.icon;
              return (
                <Card key={i} className="bg-gradient-card border-border hover:border-primary/50 transition group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:animate-pulse-glow">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Gesture {i + 1}</div>
                        <div className="font-semibold mt-1">{g.name}</div>
                        <div className="text-sm text-accent mt-2">→ {g.action}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules Phase 1 */}
      <section id="modules" className="py-24 container mx-auto">
        <div className="text-center mb-14">
          <Badge className="bg-primary/10 text-primary border border-primary/30 mb-3">Phase I — Completed</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Core <span className="text-gradient">Modules</span></h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, i) => {
            const Icon = m.icon;
            return (
              <Card key={i} className="bg-gradient-card border-border relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                <CardContent className="p-6 relative">
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{m.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                  <Badge className="mt-4 bg-primary/10 text-primary border border-primary/30">✓ Completed</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Phase 2 */}
      <section className="py-24 bg-muted/20 border-y border-border">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge className="bg-secondary/10 text-secondary border border-secondary/30 mb-3">Phase II — Roadmap</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What's <span className="text-gradient">Next</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phase2.map((m, i) => {
              const Icon = m.icon;
              return (
                <Card key={i} className="bg-gradient-card border-border">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{m.title}</h3>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-24 container mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">System <span className="text-gradient">Pipeline</span></h2>
          <p className="text-muted-foreground">From hand to action in milliseconds.</p>
        </div>
        <div className="grid md:grid-cols-6 gap-4">
          {["Input", "Capture", "Processing", "Tracking", "Recognition", "Output"].map((step, i) => (
            <div key={step} className="relative">
              <Card className="bg-gradient-card border-border h-full">
                <CardContent className="p-5 text-center">
                  <div className="text-3xl font-bold text-gradient mb-2">{i + 1}</div>
                  <div className="font-semibold">{step}</div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Code */}
      <section id="code" className="py-24 bg-muted/20 border-y border-border">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge className="bg-primary/10 text-primary border border-primary/30 mb-3">Backend</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Python + <span className="text-gradient">MediaPipe</span></h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The backend is a real-time loop that grabs webcam frames, extracts 21 hand landmarks
                with MediaPipe, evaluates which fingers are extended, and dispatches the matching
                action via <code className="text-primary">pynput</code> & <code className="text-primary">pyautogui</code>.
                On macOS, AppleScript handles native volume and brightness.
              </p>
              <div className="flex flex-wrap gap-2">
                {["OpenCV", "MediaPipe", "PyAutoGUI", "pynput", "AppleScript"].map((t) => (
                  <Badge key={t} variant="outline" className="border-border">{t}</Badge>
                ))}
              </div>
            </div>
            <Card className="bg-[hsl(230_35%_5%)] border-border overflow-hidden shadow-elegant">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">gesture_mouse.py</span>
              </div>
              <pre className="p-5 text-xs md:text-sm overflow-auto font-mono text-muted-foreground leading-relaxed max-h-[500px]">
                <code>{codeSnippet}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-24 container mx-auto">
        <div className="text-center mb-14">
          <Badge className="bg-accent/10 text-accent border border-accent/30 mb-3"><GraduationCap className="w-3 h-3 mr-1" /> LY BDCE · Group 07</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The <span className="text-gradient">Team</span></h2>
          <p className="text-muted-foreground">Guided by Dr. Nitin S. More — Department of Computer Science & Engineering, MIT-ADT University.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((p) => (
            <Card key={p.id} className="bg-gradient-card border-border text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4 animate-float">
                  {p.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">{p.id}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Publication */}
      <section className="py-24 bg-muted/20 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-card border-border shadow-elegant">
            <CardHeader>
              <Badge className="w-fit bg-secondary/10 text-secondary border border-secondary/30">Paper Submission</Badge>
              <CardTitle className="text-2xl mt-2">International Conference on Advancement in Futuristic Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <div><span className="text-foreground font-semibold">Paper ID:</span> 1719</div>
              <div><span className="text-foreground font-semibold">Title:</span> Gesture Controlled Mouse Using Machine Learning</div>
              <p className="leading-relaxed pt-2 border-t border-border">
                Gesture-controlled virtual mouse systems represent a transformative approach to
                human-computer interaction, leveraging computer vision and ML to enable contactless
                control. Hand gestures captured via cameras are processed using CNNs, background
                subtraction, and contour detection to simulate mouse functions like clicking and
                scrolling — extending accessibility and enabling novel consumer interfaces.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Hand className="w-4 h-4 text-primary" />
            © 2026 GestureMouse · MIT-ADT University, Pune
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary"><Github className="w-4 h-4" /></a>
            <span>Built with MediaPipe + Python</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
