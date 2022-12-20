import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { FullscreenButton, PictureInPictureButton, PlayButton, VolumeButton } from './buttons/';
import { InfoButton } from './buttons/Info';
import { Controls, HeaderLeft, HeaderRight, LeftControls, RightControls } from './controls';
import { Player as PlayerComponent, PlayerProps } from './Player';
import { VideoRenderer } from './renderers/video/VideoRenderer';
import { SeekBar } from './seekbar';
import { Timestamp } from './timestamp';
import { AudioRenderer } from './renderers/audio/AudioRenderer';

export default {
  title: 'Player',
  component: PlayerComponent
} as Meta;

const Template: Story<PlayerProps> = (args) => <div style={{ height: '1100px' }}><PlayerComponent {...args} /></div>;

export const VideoPlayer = Template.bind({});
VideoPlayer.args = {
  url: 'https://video.blender.org/download/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898-720.mp4',
  poster: 'https://static.suchanecki.me/jupiter.jpg',
  tag: 'video',
  aspectRatio: '16:9',
  keyboardControl: true,
  children: (
    <>
      <Controls renderers={{
        video: <VideoRenderer interactive />,
        audio: <AudioRenderer interactive />
      }} autohide>
        <HeaderLeft>
          Titleeeeeee
        </HeaderLeft>
        <HeaderRight>
          <PictureInPictureButton showLabel size='medium' />
          <InfoButton showLabel size='medium' />
        </HeaderRight>
        <SeekBar />
        <LeftControls>
          <PlayButton size='medium' />
          <VolumeButton size='medium' />
          <Timestamp />
        </LeftControls>
        <RightControls>
          <FullscreenButton size='medium' />
        </RightControls>
      </Controls>
    </>
  )
};

export const AudioPlayer = Template.bind({});
AudioPlayer.args = {
  url: 'https://foobar404.dev/Wave.js/assets/audio.mp3',
  poster: 'https://static.suchanecki.me/nasa.jpg',
  tag: 'audio',
  keyboardControl: true,
  children: (
    <>
      <Controls renderers={{
        video: <VideoRenderer interactive />,
        audio: <AudioRenderer interactive visualizations />
      }}>
        <HeaderLeft>
          Mc funky funky - Funky funky
        </HeaderLeft>
        <SeekBar />
        <LeftControls>
          <PlayButton size='medium' />
          <VolumeButton size='medium' />
          <Timestamp />
        </LeftControls>
        <RightControls>
          <InfoButton size='medium' />
        </RightControls>
      </Controls>
    </>
  )
};
