import { useRef, useEffect } from 'react';
import cn from 'classnames'
import NcModal from "shared/NcModal/NcModal";
import NextPrev from 'shared/NextPrev/NextPrev';
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TutorialData from "./tutorial";
import Checkbox from 'shared/Checkbox/Checkbox';

const Tutorial = ({ isModal, setModal }) => {
  const sliderRef = useRef(null);

  const handleCheck = (checked) => {
    if (checked) {
      localStorage.setItem("tutorial", true);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem("tutorial")) {
      setModal(true);
    }
  }, [])
  return (
    <NcModal
      isOpenProp={isModal}
      isHeader={false}
      contentExtraClass="max-w-3xl max-h-2xl"
      renderTrigger={() => { }}
      renderContent={() => (
        <div className='w-full relative mb-8'>
          <div className="show-me absolute -bottom-[25px] left-0 z-[999]">
            <Checkbox
              className='!text-sm'
              label="Don't show me again"
              onChange={handleCheck}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
          <div className="slider-arrow slider-tutorial-group">
            <NextPrev
              btnClassName="w-11 h-11 text-xl"
              onClickNext={() => sliderRef?.current?.slickNext()}
              onClickPrev={() => sliderRef?.current?.slickPrev()}
            />
          </div>
          {TutorialData.length > 0 && (
            <Slider items={1} ref={sliderRef} arrows={false} infinite={false} dots={true} lazyLoad={true}>
              {
                TutorialData.map(item => (
                  <div className='tutorial-page' key={item.id}>
                    <div className='h-[455px]'>
                      <img
                        src={item.image.src}
                        alt={item.title}
                        width={500}
                        height={400}
                      />
                    </div>
                    <div className='tutorial-content'>
                      <p className={cn('text-[26px] dark:text-white', item.id === 0 && 'my-4')}>{item.title}</p>
                      <span className='fs-3 mb--5'>{item.description}</span>
                      {
                        item.id === 0 && (
                          <div className='flex justify-center items-center relative w-full'>
                            <ButtonPrimary type="button" className='mt-4' onClick={() => sliderRef?.current?.slickNext()}>Continue</ButtonPrimary>
                            <span className='mt-4 absolute right-0 cursor-pointer' onClick={() => setModal(false)}>Skip</span>
                          </div>
                        )
                      }
                      {
                        item.id === 9 && (
                          <ButtonPrimary type="button" className='mt-4' onClick={() => setModal(false)}>Get Started</ButtonPrimary>
                        )
                      }
                    </div>
                  </div>
                ))
              }
            </Slider>
          )}
        </div>
      )}
    />
  )
}

export default Tutorial;