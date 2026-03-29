# CyberVerse – Inside a Computer

> An interactive cinematic experience exploring how computers think, remember, communicate, and defend themselves.

---

## Live Demo

🔗 Live Link : [CyberVerse](https://cyber-verse-beryl.vercel.app/)

📄 Documentation : [Project Documentation](Project_Documentation.md)

---

## Demo Preview

![CyberVerse Demo](ADD_GIF_OR_SCREENSHOT_LINK)

---

## ❗ Problem Statement

Traditional computer science education is often passive, abstract, and difficult to visualize.

Students struggle to understand how systems actually work internally — from CPU execution to network communication — because concepts are taught without interaction or real-time feedback.

---

## 💡 Solution

CyberVerse transforms technical learning into an interactive, story-driven experience where users:

- Explore system concepts visually  
- Make decisions that affect outcomes  
- Apply knowledge through real-time simulation  

This bridges the gap between theory and practical understanding.

---

## Overview

CyberVerse is a hackathon project that reimagines how people learn about computer systems. It's not a tutorial—it's a journey. Through smooth scrolling, storytelling, and interactive decision-making, users explore the hidden mechanics that power every device.

The experience unfolds in two modes:

- **Story Mode**: A cinematic scroll-through of system architecture  
- **Simulation Mode**: A real-time defense challenge  

---

## 🏆 Why CyberVerse Stands Out

- Combines education + interaction + storytelling  
- Goes beyond static tutorials into experiential learning  
- Demonstrates strong frontend engineering + product thinking  
- Designed as a deployable, scalable learning platform  

---

## ✨ Features

### Story Mode

- 🧠 **CPU Architecture** – Understand instruction pipelines, speculative execution, and core design  
- 💾 **Memory Hierarchy** – Explore cache layers, RAM, and disk storage trade-offs  
- 🌐 **Network Communication** – See how packets travel and protocols work  
- 🔐 **Security Layers** – Learn vulnerabilities from CPU to application  
- ✋ **Interactive Decisions** – Make choices that influence story outcomes  
- 🎨 **Cinematic Animations** – Smooth transitions, glowing effects, and visual storytelling  

### Simulation Mode

- 🎮 **Real-Time Defense** – Detect threats and respond to live attacks  
- 🛡️ **System Management** – Isolate infected nodes, stabilize overloads  
- 📊 **Performance Metrics** – Monitor system health in real-time  
- 🏆 **Challenge Progression** – Escalating difficulty and scenarios  
- 💫 **Particle Effects** – Animated background with theme-matched colors  

---

## 📸 Screenshots

### Story Mode
![Story Mode](ADD_IMAGE_LINK)

### Simulation Mode
![Simulation Mode](ADD_IMAGE_LINK)

---

## 🛠️ Tech Stack

| Layer                | Technology                       |
| -------------------- | -------------------------------- |
| **Frontend**         | React 18 + TypeScript            |
| **Styling**          | Tailwind CSS + Custom Animations |
| **State Management** | React Hooks                      |
| **Routing**          | React Router                     |
| **Build Tool**       | Vite                             |
| **Testing**          | Playwright + Vitest              |

---

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/Sajiree-2005/CyberVerse.git
cd CyberVerse
npm install
npm run dev

Have ideas or feedback? Open an issue or reach out:

- GitHub: [@Sajiree-2005](https://github.com/Sajiree-2005)
- Project Repo: [CyberVerse](https://github.com/Sajiree-2005/CyberVerse)

```
---

## 🎯 How to Use

1. **Start the Story** – Navigate to the Story page. Scroll through each section at your own pace.
2. **Make Decisions** – When prompted, choose between options (fast vs. secure boot, memory strategy, etc.).
3. **Observe Outcomes** – See how your choices influence the narrative and system behavior.
4. **Launch Simulation** – When ready, click "Launch Simulation" to enter real-time defense mode.
5. **Defend the System** – Respond to threats, manage resources, and restore system health.
6. **Reflect** – Return to Story Mode to deepen understanding.

---

## 🎨 Design Philosophy

- **Immersion over Information** – Prioritize experience and storytelling
- **Dark Theme, Soft Contrast** – Reduce eye strain while maintaining readability
- **Micro-interactions Matter** – Every animation serves the narrative
- **Accessibility First** – Intuitive navigation, clear feedback, readable text
- **Performance Optimized** – Smooth 60fps animations, minimal janking

---

## 🔧 Project Structure

```
src/
├── pages/
│   ├── Story.tsx        # Main story experience
│   ├── Simulation.tsx    # Defense game mode
│   └── NotFound.tsx      # 404 page
├── components/
│   ├── BootScreen.tsx    # System boot sequence
│   ├── Defense.tsx       # Defense mechanics
│   ├── HealthBar.tsx     # System health display
│   ├── Network.tsx       # Network visualization
│   └── ui/               # Shadcn UI components
├── hooks/
│   ├── useReveal.ts      # Reveal animation hook
│   └── use-toast.ts      # Toast notifications
├── lib/
│   └── utils.ts          # Utility functions
└── index.css             # Global styles & keyframes

public/
├── particles.js          # Animated particle background
├── logo.png              # CyberVerse logo
└── robots.txt
```

---

## 🌟 Key Innovations

### 1. **Narrative-Driven Education**

Traditional technical learning is passive. CyberVerse makes users _active participants_ in understanding how systems work.

### 2. **Dual-Mode Experience**

Story Mode for understanding, Simulation Mode for application. Learning through both comprehension and challenge.

### 3. **Seamless Animations**

60+ custom CSS keyframes create fluid, engaging transitions without external animation libraries.

### 4. **Interactive Particles**

A dynamic particle background that responds to theme changes and adds visual depth without performance penalty.

### 5. **Accessibility-First Design**

Dark mode optimized for readability, keyboard navigation support, and semantic HTML throughout.

---

## 📊 Performance Metrics

- ⚡ **First Contentful Paint**: < 1.2s
- 🎯 **Largest Contentful Paint**: < 2.5s
- ✨ **Cumulative Layout Shift**: < 0.1
- 🎬 **Animation Frame Rate**: Consistent 60 FPS

---

## 🔮 Future Roadmap

- [ ] Mobile-optimized Simulation Mode
- [ ] Multiplayer Scenarios
- [ ] Detailed Progress Analytics
- [ ] Custom Difficulty Modifiers
- [ ] Export System Reports
- [ ] Dark/Light Mode Toggle
- [ ] Accessibility Enhancements (WCAG 2.1 AAA)

---

## 📝 License

This project is open source under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Author

**Developed for Frontend Odyssey: The Interactive Web Experience**

CyberVerse is a passion project exploring the intersection of technical education and entertainment design.

---

## 🙏 Acknowledgments

- Inspired by immersive learning experiences and cyberpunk aesthetics
- Built with love during the Frontend Odyssey hackathon
- Special thanks to the React and Tailwind CSS communities

---

## 📞 Contact & Feedback

Have ideas or feedback? Open an issue or reach out:

- LinkedIn: www.linkedin.com/in/sajiree-damle
- GitHub: [@Sajiree-2005](https://github.com/Sajiree-2005)
- Project Repo: [CyberVerse](https://github.com/Sajiree-2005/CyberVerse)

---

**Ready to explore inside a computer? Start the experience now.**
