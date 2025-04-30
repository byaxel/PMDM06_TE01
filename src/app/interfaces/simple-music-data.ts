export interface SimpleMusicData {
    title: string;
    artist: string;
    album: string;
    albumCoverUrl: string;
    spotifyTrackId?: string;
    youtubeVideoLink?: string;
    deezerId?: string;
}

export interface Options {
    host: string;
    endpoint: string;
    signature_version: string;
    data_type: string;
    secure: boolean;
    access_key: string;
    access_secret: string;
}