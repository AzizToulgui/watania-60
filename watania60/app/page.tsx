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
import { Divider, Reveals } from "@/components/sections/shared";
import { I18nProvider } from "@/lib/i18n";

export default function Home() {
  return (
    <I18nProvider>
      <ArchiveProvider>
      <Header />
      <main>
        <ArchiveSphere />
        <MemorySearch />
        <Divider tc="00:12:48:00" />
        <Restoration />
        <Divider tc="00:19:02:12" />
        <Companion />
        <Divider tc="00:27:36:04" />
        <Subtitles />
        <Divider tc="00:34:10:20" />
        <CreatorStudio />
        <Divider tc="00:41:55:08" />
        <Together />
        <Divider tc="00:48:21:16" />
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
