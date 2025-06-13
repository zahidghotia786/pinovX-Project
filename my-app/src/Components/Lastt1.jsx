import React from 'react';
import img1O from '../assets/o (1).png';
import img2 from '../assets/o (2).png';
import img3 from '../assets/o (3).png';
import img4 from '../assets/o (4).png';
export default function lLast() {
  return (
    <div className="mt-8 pb-10">
      <div className="w-full border border-[#24C867] flex flex-wrap justify-around items-center gap-4 p-4">
        
        {/* Image 1 */}
        <img
          className="w-[140px] sm:w-[180px] md:w-[220px] lg:w-[240px]"
          src={img3}
          alt="img3"
        />

        {/* Image 2 */}
        <img
          className="w-[130px] sm:w-[170px] md:w-[210px] lg:w-[230px]"
          src={img4}
          alt="img4"
        />

        {/* Text with image ("apayl" + image) */}
        <div className="flex  items-center justify-center text-center">
          <p className="text-white text-3xl sm:text-4xl md:text-5xl">apayl</p>
          <img
            className="w-[30px] sm:w-[40px] md:w-[53px] mt-1"
            src={img1O}
            alt="img1O"
          />
        </div>

        {/* Small container with zoomed-in image */}
        <div className="flex justify-center items-center h-[70px] w-[78px] overflow-hidden ">
          <img className="scale-[3] sm:scale-[3.5] ml-2" src={img2} alt="img2" />
        </div>
        
      </div>


    <div className="mx-auto w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] mt-11 p-6 text-center bg-white rounded-3xl shadow-lg">
  <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
    <span className="font-semibold text-black">PinovX</span> is a non-custodial platform. We do not hold customer cryptocurrency.
    Live rates are indicative and may differ from final settlement rates.
  </p>
</div>

        <div className=''>

{/* ______________-___________________________________________________footer___________________________ */}


        </div>

    </div>
  );
}
