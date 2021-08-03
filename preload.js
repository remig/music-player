/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { contextBridge} = require('electron');

contextBridge.exposeInMainWorld(
    'electron',
    {
        getMusicTree() {
            const res = {};
            const artists = fs.readdirSync('./music');
            for (const artist of artists) {
                res[artist] = {};
                const albums = fs.readdirSync(`./music/${artist}`);
                for (const album of albums) {
                    res[artist][album] = fs
                        .readdirSync(`./music/${artist}/${album}`)
                        .filter(el => el.endsWith('.mp3'));
                }
            }
            return res;
        }
    }
);
