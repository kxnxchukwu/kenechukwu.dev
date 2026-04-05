import { IconSet } from '../IconSet';

export default function About() {
  return (
    <div className="md:max-w-[420px] m-6 md:m-20 mt-[50px] lg:mt-[180px]">
      <h1 className="text-neutral-700 font-semibold pb-6">about</h1>

      <p className="leading-[25px] pb-4 text-neutral-500 font-[380] w-11/12">
        I'm a Frontend Engineer with 4+ years of experience building scalable,
        high-performance web applications. I care deeply about accessibility,
        clean architecture, and the kind of attention to detail that makes
        interfaces feel genuinely good to use.
      </p>

      <p className="leading-[25px] pb-4 text-neutral-500 font-[380] w-11/12">
        I have a master's degree in Data Analytics from the National College of
        Ireland and a BSc in Computer Science from Babcock University in
        Nigeria. Outside of frontend work I have hands-on experience with
        machine learning and deep learning — which gives me an unusually broad
        perspective when working across teams.
      </p>

      <p className="leading-[25px] pb-4 text-neutral-500 font-[380] w-11/12">
        When I'm not building things I'm usually listening to the{' '}
        <a
          aria-label="Frontend Happy Hour Podcast Website"
          href="https://frontendhappyhour.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-900 border-b hover:text-neutral-400"
        >
          Front End Happy Hour
        </a>{' '}
        podcast or music on{' '}
        <a
          aria-label="My Apple Music Heavy Rotation Playlist"
          href="https://music.apple.com/ng/playlist/heavy-rotation/pl.pm-d5779e520ff52d7f662733f8b6827a26"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-900 border-b hover:text-neutral-400"
        >
          Apple Music
        </a>
        , or taking a walk somewhere when Dublin decides to cooperate with the
        weather.
      </p>

      <div className="pt-2">
        <p className="text-xs text-neutral-400 tracking-widest pb-4">find me</p>
        <IconSet />
      </div>
    </div>
  );
}
