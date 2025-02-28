
import Script from "next/script";

const TawktoChat = () => {
  return (
    <Script
      id="tawk-script"
      strategy="lazyOnload"
    >
      {`
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/67b41a75d6bd71190dd56f6a/1ikboempb';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
    `}
    </Script>


  );
};
export default TawktoChat;