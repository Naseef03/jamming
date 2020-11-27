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

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: headers
        });
        if (response.ok) {
            return response.json();
        }
        const jsonResponse = undefined;
        userId = jsonResponse.id;
        const response_1 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name })
        });
        if (response_1.ok) {
            return response_1.json();
        } else {
            console.log('API request failed');
        }
        const jsonResponse_1 = undefined;
        const playlistId = jsonResponse_1.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackURIs })
        });

        
    }
};
