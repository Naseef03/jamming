const ClientID = '5f677065c3b24845a5ce6bce4d21d295';
const redirectUri = "http://localhost:3000";

let accessToken;

export const Spotify = {
    getAccessToken(){
        if (accessToken){
            return accessToken
        }
        
        
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]); 

            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessUrl = 'https://accounts.spotify.com/authorize?client_id=' + ClientID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + redirectUri;
            window.location = accessUrl
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken();
        console.log('hi')
        
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async savePlaylist(name, trackURIs){
        if(!name || !trackURIs.length) {
            return
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;

        let response = await fetch('https://api.spotify.com/v1/me', {headers: headers});
        let jsonResponse = await response.json();
        userId = jsonResponse.id;
        response = await fetch(`/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
        });
        jsonResponse = await response.json();
        const playlistID = jsonResponse.id;
        return fetch(`/v1/users/${userId}/playlists/${playlistID}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
        })
    }
};
