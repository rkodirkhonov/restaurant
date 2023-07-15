import React from 'react';

import { images } from '../../constants';
import { SubHeading } from '../../components';
import './Chef.css';

const Chef = () => (
  <div className='app__bg app__wrapper section__padding'>
    <dir className='app__wrapper_img app__wrapper_img-reverse'>
      <img src={images.chef} alt="chef" />
    </dir>

    <div className='app__wrapper_info'>
      <SubHeading title="Chef's Word" />
      <h1 className='headtext__cormorant'>What We Believe In</h1>

      <div className='app__chef-content'>
        <div className='app__chef-content_quote'>
          <img src={images.quote} alt="quote" />
          <p className='p__opensans'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque odio, sint quia accusamus dolor, et, quibusdam minus dicta sunt officiis iste ea. Recusandae quasi molestiae debitis, ipsam corporis ipsum iure.</p>
        </div>
        <p className='p__opensans'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam ipsam totam vero debitis, doloremque ullam? Quibusdam quo minus dolore repellendus eius dolorem, non nostrum, ipsum doloremque neque enim, nam fugit!</p>
      </div>

      <div className='app__chef-sign'>
        <p>Kevin Luo</p>
        <p className='p__opensans'>Chef & Founder</p>
        <img src={images.sign} alt="sign" />
      </div>

    </div>
  </div>
);

export default Chef;
