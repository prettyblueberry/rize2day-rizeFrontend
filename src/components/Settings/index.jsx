import { useState, useRef, useEffect, Fragment } from 'react';
import cn from 'classnames'
import { FiSettings } from 'react-icons/fi';
import NcModal from "shared/NcModal/NcModal";
import NextPrev from 'shared/NextPrev/NextPrev';
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Popover, Transition } from "@headlessui/react";
import TutorialData from "./tutorial";
import Checkbox from 'shared/Checkbox/Checkbox';

const Settings = ({ className = "" }) => {
  const [isModal, setModal] = useState(false);
  const sliderRef = useRef(null);

  const openModal = async () => {
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }

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
    <div className={cn("icon-box", className)}>
      <Popover className="relative">
        <Popover.Button
          className={`relative text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center`}
        >
          <FiSettings size={22} />
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3 -right-10 sm:right-0 sm:px-0">
            <div className="overflow-hidden shadow-lg rounded-3xl ring-1 ring-black ring-opacity-5">
              <div className="relative grid grid-cols-2 gap-6 justify-around px-6 py-3 bg-white dark:bg-neutral-800">
                <button className="text-2xl md:text-3xl w-12 h-12 rounded-full text-neutral-700 m-auto dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center" onClick={openModal}>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    height="24"
                    width="24"
                  >
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 000 2.5v11a.5.5 0 00.707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 00.78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0016 13.5v-11a.5.5 0 00-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                  </svg>
                </button>
                <div id="my_switcher" className="setting-option my_switcher">
                  <SwitchDarkMode />
                </div>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
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
                              <span className='mt-4 absolute right-0 cursor-pointer' onClick={closeModal}>Skip</span>
                            </div>
                          )
                        }
                        {
                          item.id === 9 && (
                            <ButtonPrimary type="button" className='mt-4' onClick={closeModal}>Get Started</ButtonPrimary>
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
    </div>
  );
};

export default Settings;
