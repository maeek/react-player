import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AudioRenderer, DefaultLayout, FullscreenButton, HeaderLeft, HeaderRight,
  LeftControls, PictureInPictureButton, Player, PlayButton, QualitySelector,
  RightControls, SeekBar, Timestamp, VideoRenderer, VolumeButton, useMediaControls
} from '../index';
import './demo.scss';

const VIDEO = '/media/big-buck-bunny-480p.mp4';
const POSTER = '/media/big-buck-bunny-poster.jpg';
const qualities = [
  { url: VIDEO, quality: '480p' },
  { url: '/media/big-buck-bunny-360p.mp4', quality: '360p' }
];

const meta: Meta<typeof Player> = {
  title: 'Player',
  component: Player,
  parameters: { layout: 'fullscreen', controls: { exclude: [ 'children', 'getNodeElement' ] } }
};
export default meta;
type Story = StoryObj<typeof Player>;

const DemoFrame = ({ children, audio = false }: { children: React.ReactNode; audio?: boolean }) => (
  <main className='player-demo'>
    <div className='player-demo-inner'>
      <header className='player-demo-brand'>
        <span className='player-demo-mark'>▶</span>
        <span>react-player</span>
        <span className='player-demo-badge'>REACT + TYPESCRIPT</span>
      </header>
      <div className='player-demo-intro'>
        <span className='player-demo-eyebrow'>{audio ? 'AUDIO EXPERIENCE' : 'VIDEO EXPERIENCE'}</span>
        <h1>Your media. Your controls.</h1>
        <p>Composable playback for the web. Built to fit your interface.</p>
      </div>
      <section className='player-demo-card' aria-label={audio ? 'Audio player demo' : 'Video player demo'}>
        {children}
        <div className='player-demo-caption'>
          <div>
            <strong>Big Buck Bunny</strong>
            <span>Blender Foundation · {audio ? 'Trailer soundtrack' : 'Official trailer'}</span>
          </div>
          <span className='player-demo-format'>{audio ? 'MP3 / AUDIO' : 'MP4 / H.264'}</span>
        </div>
      </section>
      <footer className='player-demo-footer'>
        <span>{audio ? 'Audio visualization · Custom controls'
          : 'Keyboard shortcuts · Quality selection · Picture in picture'}</span>
        <a href='https://peach.blender.org/about/' target='_blank' rel='noreferrer'>Film: Blender Foundation · CC BY 3.0 ↗</a>
      </footer>
    </div>
  </main>
);

export const VideoPlayer: Story = {
  args: {
    url: VIDEO, tag: 'video', poster: POSTER, qualities,
    aspectRatio: '16:9', forceAspectRatio: true, preload: 'metadata', keyboardShortcuts: true, volume: 0.6
  },
  render: args => (
    <DemoFrame>
      <Player {...args}>
        <DefaultLayout renderers={{ video: <VideoRenderer interactive /> }} autohide>
          <HeaderLeft>Big Buck Bunny <span className='player-demo-title-detail'>/ Trailer</span></HeaderLeft>
          <HeaderRight><PictureInPictureButton /></HeaderRight>
          <SeekBar />
          <LeftControls><PlayButton /><VolumeButton /><Timestamp /></LeftControls>
          <RightControls><QualitySelector /><FullscreenButton /></RightControls>
        </DefaultLayout>
      </Player>
    </DemoFrame>
  )
};

export const AudioPlayer: Story = {
  args: {
    url: '/media/big-buck-bunny-audio.mp3', tag: 'audio', poster: POSTER,
    preload: 'metadata', keyboardShortcuts: true, volume: 0.6
  },
  render: args => (
    <DemoFrame audio>
      <Player {...args}>
        <DefaultLayout renderers={{ audio: <AudioRenderer interactive visualizations /> }}>
          <HeaderLeft>Big Buck Bunny <span className='player-demo-title-detail'>/ Soundtrack</span></HeaderLeft>
          <SeekBar />
          <LeftControls><PlayButton /><VolumeButton /><Timestamp /></LeftControls>
        </DefaultLayout>
      </Player>
    </DemoFrame>
  )
};

const JumpButton = () => {
  const { seek } = useMediaControls();
  return <button className='player-demo-custom-button' onClick={() => seek(10)}>Jump to 00:10</button>;
};

export const CustomControls: Story = {
  ...VideoPlayer,
  render: args => (
    <DemoFrame>
      <Player {...args}>
        <DefaultLayout renderers={{ video: <VideoRenderer interactive /> }}>
          <HeaderLeft>Custom controls</HeaderLeft>
          <SeekBar />
          <LeftControls><PlayButton /><Timestamp /><JumpButton /></LeftControls>
          <RightControls><FullscreenButton /></RightControls>
        </DefaultLayout>
      </Player>
    </DemoFrame>
  )
};
