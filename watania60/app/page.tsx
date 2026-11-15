import { ArchiveProvider } from "@/components/ArchiveContext";
import ArchiveGrid from "@/components/ArchiveGrid";
import ArchiveSphere from "@/components/ArchiveSphere";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Grain from "@/components/Grain";
import Header from "@/components/Header";
import IntroFilm from "@/components/IntroFilm";
import Lightbox from "@/components/Lightbox";
import Menu from "@/components/Menu";
import Splash from "@/components/Splash";
import Companion from "@/components/sections/Companion";
import CreatorStudio from "@/components/sections/CreatorStudio";
import FinalCta from "@/components/sections/FinalCta";
import MemorySearch from "@/components/sections/MemorySearch";
import Restoration from "@/components/sections/Restoration";
import Subtitles from "@/components/sections/Subtitles";
import Timeline from "@/components/sections/Timeline";
import Together from "@/components/sections/Together";
import { Reveals } from "@/components/sections/shared";
import { I18nProvider } from "@/lib/i18n";

export default function Home() {
  return (
    <I18nProvider>
      <ArchiveProvider>
      <Header />
      <main>
        <ArchiveSphere />
        <MemorySearch />
        <Restoration />
        <Companion />
        <Subtitles />
        <CreatorStudio />
        <Together />
        <Timeline />
        <FinalCta />
      </main>
      <Footer />
      <ArchiveGrid />
      <Menu />
      <Lightbox />
      <Grain />
      <IntroFilm />
      <Splash />
      <Cursor />
      <Reveals />
      </ArchiveProvider>
    </I18nProvider>
  );
}
