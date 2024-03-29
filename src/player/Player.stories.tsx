import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { FullscreenButton, PictureInPictureButton, PlayButton, VolumeButton } from './buttons/';
import { InfoButton } from './buttons/Info';
import { DefaultLayout, HeaderLeft, HeaderRight, LeftControls, RightControls } from './controls';
import { Player as PlayerComponent, PlayerProps } from './Player';
import { VideoRenderer } from './renderers/video/VideoRenderer';
import { SeekBar } from './seekbar';
import { Timestamp } from './timestamp';
import { AudioRenderer } from './renderers/audio/AudioRenderer';
import { QualitySelector } from './buttons/QualitySelector';

export default {
  title: 'Player',
  component: PlayerComponent
} as Meta;

const Template: Story<PlayerProps> = (args) => <div style={{ height: '1100px' }}><PlayerComponent {...args} /></div>;

export const VideoPlayer = Template.bind({});
VideoPlayer.args = {
  url: 'https://video.blender.org/download/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898-720.mp4',
  qualities: [
    {
      url: 'https://video.blender.org/download/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898-720.mp4',
      quality: '720p'
    },
    {
      url: 'https://video.blender.org/download/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898-480.mp4',
      quality: '480p'
    },
    {
      url: 'https://video.blender.org/download/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898-360.mp4',
      quality: '360p'
    },
    {
      url: 'https://video.blender.org/download/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898-240.mp4',
      quality: '240p'
    }
  ],
  poster: 'https://static.suchanecki.me/jupiter.jpg',
  tag: 'video',
  aspectRatio: '16:9',
  keyboardShortcuts: true,
  children: (
    <>
      <DefaultLayout renderers={{
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
          <QualitySelector />
          <FullscreenButton size='medium' />
        </RightControls>
      </DefaultLayout>
    </>
  )
};

export const AudioPlayer = Template.bind({});
AudioPlayer.args = {
  url: 'https://static.suchanecki.me/audio.mp3',
  poster: 'https://static.suchanecki.me/nasa.jpg',
  tag: 'audio',
  keyboardControl: true,
  children: (
    <>
      <DefaultLayout renderers={{
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
      </DefaultLayout>
    </>
  )
};
