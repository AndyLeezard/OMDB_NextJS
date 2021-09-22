import React from 'react';
import { environment } from '../../environments/environment';

const Footer: React.FC = ():JSX.Element => {
    return (
        <div className='footer'>
            <a href={environment.contact_candidate} target="_blank" rel="noopener noreferrer">
                <p>Built & submitted by Andy Lee</p>
            </a>
        </div>
    )
}

export default Footer
