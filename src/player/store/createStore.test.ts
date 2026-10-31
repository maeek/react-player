import { createPlayerStore } from './createStore';
import { setUrl } from './slices/config';
import { setCurrentTime } from './slices/media';
import { setVolume } from './slices/volume';

describe('player state', () => {
  it('initializes the matching renderer before child effects mount', () => {
    expect(createPlayerStore().getState().config.type).toBe('video');
    expect(createPlayerStore('audio').getState().config.type).toBe('audio');
  });

  it('keeps media, progress and volume independent between players', () => {
    const video = createPlayerStore();
    const audio = createPlayerStore('audio');
    const originalAudio = audio.getState();

    video.dispatch(setUrl('/movie.mp4'));
    video.dispatch(setCurrentTime(10));
    video.dispatch(setVolume(0.25));

    expect(video.getState().config.url).toBe('/movie.mp4');
    expect(video.getState().media.currentTime).toBe(10);
    expect(video.getState().volume.volume).toBe(0.25);
    expect(audio.getState()).toEqual(originalAudio);
  });
});
