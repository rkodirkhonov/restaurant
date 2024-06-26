import React from 'react';
import { SubHeading } from '../../components';
import { images } from '../../constants';

const FindUs = () => (
  <div className='app__bg app__wrapper section__padding' id='contact'>
    <div className='app__wrapper_info'>
      <SubHeading title = "Contact" />
      <h1 className='headtext__cormorant' style={{marginTop: '3rem'}}>Find Us</h1> 
      <div className='app__wrapper-content'>
        <p className='p__opensans'>Lane Ends Bungalow, Whatcroft Hall Lane, Rudhealth, CW9 75G</p>
        <p className='p__cormorant' style={{color: '#DCCA87', margin: '2rem'}}>Opening Hours</p>
        <p className='p__opensans'>Mon - Fri: 10:00 am - 02:00 am</p>
        <p className='p__opensans'>Sat - Sun: 10:00 am - 03:00 am</p>
      </div>
    </div>

    <button className='custom__button' style={{marginTop: '2rem'}}>Visit Us</button>
    <div className='app__wrapper_img'>
        <img src={images.findus} alt="findus" />
    </div>
  </div>
);

export default FindUs;
