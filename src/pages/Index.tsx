import HealthBar from "@/components/HealthBar";
import BootScreen from "@/components/BootScreen";
import Network from "@/components/Network";
import Meltdown from "@/components/Meltdown";
import Defense from "@/components/Defense";
import Recovery from "@/components/Recovery";

const Index = () => {
  return (
    <div className="relative">
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

export default Index;
