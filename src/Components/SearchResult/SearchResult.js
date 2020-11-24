import React from 'react';

import './SearchResult.css';

export class SearchResult extends React.Component {
    render() {
        return(
            <div className="SearchResults">
                <h2>Results</h2>
                <TrackList />
            </div>
        )
    }
}