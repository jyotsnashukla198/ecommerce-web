"use client";

import { useEffect,useRef } from "react";

function throttle(fn,delay){
    let lastCall = 0;
    return function(...args){
        const now = Date.now();
        if(now-lastCall>delay){
            lastCall = now;
            fn.apply(args)
        }
    }

}

function debounce(fn,delay){
    let timer;
    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}
export default function SorryPage(){
     const containerRef = useRef();
    useEffect(()=>{
    const handleScroll = throttle(() => {
    console.log("Scroll event handled");
    }, 500);
    window.addEventListener("scroll", handleScroll);
            const handleSearch = debounce(() => {
        console.log("Calling API...");
        }, 500);

      window.addEventListener("scroll", handleSearch);

      const observer = new IntersectionObserver((entries)=>{
       entries.forEach((entry)=>{
        if(entry.isIntersecting){
           console.log("element is visible");
        }
       })
      },
      {
        rootMargin: '0px 0px 0px 0px',
        threshold: 0
    }
    )

    if (containerRef.current) observer.observe(containerRef.current);
    },[])


    return(
        <div className="sorryContainer">
            <h2>We are sorry to go! Please visit our website</h2>
            <div className="sorryContainerChild">
              <img src="/uploads/1772765375264-wxr1kkr4jhj.jpg"></img>  
              <img  ref={containerRef} src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920"></img> 
            </div>      
       </div>
    )
}