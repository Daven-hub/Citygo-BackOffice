import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import $ from 'jquery'
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
  

  useEffect(() => {
    $(function () {
      let toggleValue = false;
      $(document).on("click", ".btn-filter", function () {
        toggleValue = !toggleValue;
        const pixel = $('.banerpp').prop("scrollHeight");
        if (toggleValue) {
          $(".filter-component").css("height", `calc(${2.5*pixel}px + 2rem)`);
        } else {
          $(".filter-component").css("height", `0px`);
        }
      });
    });
  },[])

  useEffect(() => {
    const handleOpen = () => {
      $('.side-ccca').toggleClass('active');
      $('.corps-admin').toggleClass('active');
      $('.big-overlay').toggleClass('active');
    };
  
    const handleClose = () => {
      $('.side-ccca').removeClass('active');
      $('.corps-admin').removeClass('active');
      $('.big-overlay').removeClass('active');
    };
  
    $('.btn-menu').on('click', handleOpen);
    $('.menu-close, .big-overlay').on('click', handleClose);
  
    return () => {
      $('.btn-menu').off('click', handleOpen);
      $('.menu-close, .big-overlay').off('click', handleClose);
    };
  }, []);
  
  const setIsSidebarOpen=()=>{
    $('.side-ccca').removeClass('active');
      $('.corps-admin').removeClass('active');
      $('.big-overlay').removeClass('active');
  }

  
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className='fixed w-full transition-all duration-300 bg-black bg-opacity-80 z-20 h-full top-0 left-0 big-overlay'></div>
      <Sidebar setIsSidebarOpen={setIsSidebarOpen}/>

      <div className="w-full transition-all duration-500 bg-gray-50 corps-admin flex flex-col">
        <Navbar />
        <main className="flex-1 px-6 max-md:px-[4%] py-7">
          <Outlet />
        </main>
        {/* <FooterAdmin /> */}
      </div>
    </div>
  );
}

export default Layout;
