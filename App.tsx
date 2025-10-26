import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ChannelList from './components/ChannelList';
import { CHANNELS } from './constants';
import type { Channel } from './types';
import {
  PlayIcon,
  PauseIcon,
  MutedIcon,
  UnmutedIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon
} from './components/PlayerIcons';


export default function App() {
  const [currentChannel, setCurrentChannel] = useState<Channel>(CHANNELS[0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleChannelSelect = (channel: Channel) => {
    setCurrentChannel(channel);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(e => console.error("Play error", e));
    } else {
      video.pause();
    }
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted && video.volume === 0) {
      video.volume = 0.5; // Set a default volume if unmuting from volume 0
    }
    video.muted = !video.muted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    video.muted = newVolume === 0;
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };


  return (
    <div className="bg-black min-h-screen text-white">
      <div className="w-full bg-black shadow-lg shadow-black/30">
        <header className="text-center pt-4 pb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text animated-logo-text">
            SSS TV
          </h1>
          <p className="text-gray-400 text-lg mt-1">by Rana Shakir</p>
        </header>
        <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 pb-4">
          <VideoPlayer 
            src={currentChannel.url} 
            channelName={currentChannel.name}
            videoRef={videoRef}
            playerContainerRef={playerContainerRef}
            setIsPlaying={setIsPlaying}
            setIsMuted={setIsMuted}
            setVolume={setVolume}
            handlePlayPause={handlePlayPause}
          />
          <div className="flex justify-center items-center gap-4 sm:gap-6 mt-4 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full max-w-sm mx-auto">
            <button onClick={handlePlayPause} className="text-white hover:text-purple-400 transition-colors p-2" aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handleMute} className="text-white hover:text-purple-400 transition-colors p-2" aria-label={isMuted ? "Unmute" : "Mute"}>
                {isMuted || volume === 0 ? <MutedIcon /> : <UnmutedIcon />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                aria-label="Volume"
              />
            </div>
            <button onClick={handleFullscreen} className="text-white hover:text-purple-400 transition-colors p-2" aria-label={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
            </button>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChannelList channels={CHANNELS} onSelectChannel={handleChannelSelect} activeChannelName={currentChannel.name} />
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </div>
  );
}