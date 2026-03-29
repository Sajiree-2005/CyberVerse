import { useNavigate } from "react-router-dom";
import HealthBar from "@/components/HealthBar";
import BootScreen from "@/components/BootScreen";
import Network from "@/components/Network";
import Meltdown from "@/components/Meltdown";
import Defense from "@/components/Defense";
import Recovery from "@/components/Recovery";

const Simulation = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Back to story */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-2 rounded-md bg-background/80 backdrop-blur border border-border text-muted-foreground text-xs font-mono tracking-wider hover:border-foreground/30 hover:text-foreground transition-all duration-200"
      >
        ← Story Mode
      </button>

      <HealthBar />
      <div className="pt-10">
        <BootScreen />
        <Network />
        <Meltdown />
        <Defense />
        <Recovery />
      </div>
    </div>
  );
};

export default Simulation;
