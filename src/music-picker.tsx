import React, {useState, useEffect} from 'react';
import {Button, Modal, PageHeader} from 'antd';
import {CaretRightOutlined, PlusOutlined} from '@ant-design/icons';

const musicPickerLevels = {
    artist: 'Artists',
    album: 'Albums',
    song: 'Songs'
};

type PickerLevels = "artist" | "album" | "song";

interface MusicPickerProps {
    tree: any;
    play: (artist: string, album?: string, song?: string) => void;
    add: (artist: string, album?: string, song?: string) => void;
}

export const MusicPicker = ({tree, play, add}: MusicPickerProps) => {

    const [showPicker, setShowPicker] = useState<boolean>(false);
    const [pickerContent, setPickerContent] = useState<string[]>([]);
    const [pickerLevel, setPickerLevel] = useState<PickerLevels>("artist");
    const [pickerAritst, setPickerAritst] = useState<string>('');
    const [pickerAlbum, setPickerAlbum] = useState<string>('');

    useEffect(() => {
        setPickerContent(Object.keys(tree || {}));
        setPickerLevel("artist");
    }, [tree]);

    function addMusic() {
        setPickerContent(Object.keys(tree || {}));
        setPickerLevel('artist');
        setPickerAritst('');
        setPickerAlbum('');
        setShowPicker(true);
    }

    function nextPickerLevel(currentLevel: PickerLevels, key: string) {
        if (currentLevel === 'artist') {
            setPickerContent(Object.keys(tree[key]));
            setPickerLevel('album');
            setPickerAritst(key);
        } else if (currentLevel === 'album') {
            setPickerContent(tree[pickerAritst][key]);
            setPickerLevel('song');
            setPickerAlbum(key);
        }
    }

    function prevPickerLevel(currentLevel: PickerLevels, key: string) {
        if (currentLevel === 'album') {
            setPickerContent(Object.keys(tree || {}));
            setPickerLevel('artist');
            setPickerAlbum('');
        } else if (currentLevel === 'song') {
            setPickerContent(Object.keys(tree[pickerAritst]));
            setPickerLevel('album');
            setPickerAritst(key);
        }
    }

    function playSomething(key: string): void {
        if (pickerLevel === 'artist') {
            play(key);
        } else if (pickerLevel === 'album') {
            play(pickerAritst, key);
        } else if (pickerLevel === 'song') {
            play(pickerAritst, pickerAlbum, key);
        }
        hide();
    }

    function addSomething(key: string): void {
        if (pickerLevel === 'artist') {
            add(key);
        } else if (pickerLevel === 'album') {
            add(pickerAritst, key);
        } else if (pickerLevel === 'song') {
            add(pickerAritst, pickerAlbum, key);
        }
    }

    function hide() {
        setShowPicker(false);
    }

    return (
        <>
            <Button type="primary" onClick={addMusic}>
                Music Library
            </Button>
            <Modal
                title="Add Music"
                visible={showPicker}
                onCancel={hide}
                className="music-picker"
                footer={
                    <Button type="primary" onClick={hide}>Ok</Button>
                }
            >
                <PageHeader
                    title={musicPickerLevels[pickerLevel]}
                    className="music-picker-title"
                    onBack={
                        pickerLevel === 'album'
                            ? () => prevPickerLevel(pickerLevel, '')
                            : pickerLevel === 'song'
                                ? () => prevPickerLevel(pickerLevel, pickerAritst)
                                : undefined  // eslint-disable-line no-undefined
                    }
                />
                {
                    pickerContent.map(key => {
                        return (
                            <div key={key} className="button-list">
                                <Button.Group style={{width: 250}}>
                                    <Button
                                        type="primary"
                                        block={true}
                                        onClick={
                                            pickerLevel === 'song'
                                                ? () => playSomething(key)
                                                : () => nextPickerLevel(pickerLevel, key)
                                        }
                                    >
                                        {key}
                                    </Button>
                                    <Button
                                        className="icon-button"
                                        icon={<CaretRightOutlined />}
                                        onClick={() => playSomething(key)}
                                        />
                                    <Button
                                        className="icon-button"
                                        icon={<PlusOutlined />}
                                        onClick={() => addSomething(key)}
                                    />
                                </Button.Group>
                            </div>
                        );
                    })
                }
            </Modal>
        </>
    );
};
