import React from 'react';

import './Track.css';

export class Track extends React.Component {
    renderAction() {
        if(this.props.isRemoval) {
            return <button class="Track-action">-</button>
        } else {
            return <button class="Track-action">+</button>
        }
    }
    
    render(){
        return(
            <div class="Track">
                <div class="Track-information">
                    <h3>track name will go here</h3>
                    <p>track artist will go here| track album will go here </p>
                 </div>
                {this.renderAction()}
            </div>
        )
    }
}