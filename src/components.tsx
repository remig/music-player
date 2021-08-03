import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import {Button, Layout, PageHeader} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import 'react-h5-audio-player/lib/styles.css';
import './app.css';
import AudioPlayer from 'react-h5-audio-player';
import {MusicPicker} from './music-picker';

declare global {
    interface Window {
        electron: {
            getMusicTree: () => any;
        }
    }
}

if (window.location.hostname === 'localhost') {
    window.electron = {
        getMusicTree() {
            return {};
        }
    };
}

const {Footer, Content} = Layout;

interface Track {
    idx: number;
    filename: string;
}

function App() {
    const [tree, setTree] = useState<any>(null);
    const [playList, setPlayList] = useState<string[]>([]);
    const [track, setTrack] = useState<Track | null>(null);
    const [autoPlay, setAutoPlay] = useState<boolean>(false);
    const player = useRef<any>(null);

    useEffect(() => {
        setTree(window.electron.getMusicTree());
    }, []);
    
    function next() {
        setAutoPlay(true);
        setTrack(prevState => {
            if (prevState == null) {
                return null;
            }
            const newIdx = (prevState.idx + 1) % playList.length;
            return {
                idx: newIdx,
                filename: playList[newIdx]
            };
        });
    }
    
    function prev() {
        setTrack(prevState => {
            if (prevState == null) {
                return null;
            }
            const newIdx = (prevState.idx === 0)
                ? playList.length - 1
                : prevState.idx - 1;
            return {
                idx: newIdx,
                filename: playList[newIdx]
            };
        });
    }

    function jumpToTrack(newIdx: number) {
        setAutoPlay(true);
        setTrack({
            idx: newIdx,
            filename: playList[newIdx]
        });
    }

    function buildTrackList(artist: string, album?: string, song?: string): string[] {
        let tracks: string[] = [];
        if (album) {
            if (song) {
                tracks = [`./music/${artist}/${album}/${song}`];
            } else {
                const folder =`./music/${artist}/${album}`;
                tracks = tree[artist][album].map((track: string) => {
                    return `${folder}/${track}`;
                });
            }
        } else {
            const folder = `./music/${artist}`;
            const artistTree = tree[artist];
            for (const album of Object.keys(artistTree)) {
                const albumTracks = artistTree[album];
                for (const song of albumTracks) {
                    tracks.push(`${folder}/${album}/${song}`);
                }
            }
        }
        return tracks;
    }

    function handleMusicPickerPlay(artist: string, album?: string, song?: string): void {
        const newTracks = buildTrackList(artist, album, song);
        setAutoPlay(true);
        setPlayList(newTracks);
        setTrack({idx: 0, filename: newTracks[0]});
    }

    function handleMusicPickerAdd(artist: string, album?: string, song?: string): void {
        const newTracks = buildTrackList(artist, album, song);
        setPlayList(prevState => {
            return [...prevState, ...newTracks];
        });
    }

    function cleanTrackName(song: string): string {
        return song
            .substring(song.lastIndexOf('/') + 1)
            .replace('.mp3', '')
            .replace(/^[0-9]* ?- ?/, '');
    }

    function cleanPlayerTrackName(song?: string): string {
        return (song || '')
            .replace('./music/', '')
            .replace(/\//ig, ' - ')
            .replace('.mp3', '');
    }

    function clearPlayer() {
        player?.current?.audio.current.load();
    }

    function clearPlayList() {
        setPlayList([]);
        setTrack(null);
        setTimeout(clearPlayer, 0);
    }

    function removeSongFromPlaylist(idx: number): void {
        setPlayList(prevState => {
            prevState.splice(idx, 1);
            return [...prevState];
        });
    }

    return (
        <Layout>
            <Content>
                <PageHeader>
                    <MusicPicker
                        tree={tree}
                        play={handleMusicPickerPlay}
                        add={handleMusicPickerAdd}
                    />
                </PageHeader>
                <PageHeader title="Amelie's Play List" />
                <ol className="playlist">
                    {
                        playList.map((el, idx) => {
                            return (
                                <li
                                    key={idx}
                                    className={track?.idx === idx ? 'playlist-selected-track' : ''}
                                >
                                    <Button
                                        size="small"
                                        className="playlist-delete-button"
                                        icon={<CloseOutlined />}
                                        onClick={() => removeSongFromPlaylist(idx)}
                                    />
                                    <span
                                        onClick={() => jumpToTrack(idx)}
                                        style={{cursor: 'pointer'}}
                                    >
                                        {cleanTrackName(el)}
                                    </span>
                                </li>
                            );
                        })
                    }
                </ol>
                <PageHeader>
                    <Button type="primary" onClick={clearPlayList}>Clear List</Button>
                </PageHeader>
            </Content>
            <Footer>
                <AudioPlayer
                    ref={player}
                    src={track?.filename}
                    showSkipControls={true}
                    showFilledVolume={true}
                    showJumpControls={false}
                    showDownloadProgress={false}
                    onClickNext={next}
                    onClickPrevious={prev}
                    autoPlayAfterSrcChange={autoPlay}
                    header={cleanPlayerTrackName(track?.filename)}
                    onEnded={next}
                    customAdditionalControls={[]}
                />
            </Footer>
        </Layout>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));
