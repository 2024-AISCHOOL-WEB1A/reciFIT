import React from 'react'
import '../assets/css/footer.css'

const Footer = () => {
  return (
    <footer id="site-footer" className="site-footer">
      <div className="footer-container">
        <div className="FooterLogo">
          <span className="ab-text">reciFIT</span>
        </div>
        <div className="FooterInfo">
          <ul className="FooterInfo-list">
            <li className="FooterInfo-item">(주)</li>
            <li className="FooterInfo-item no-Bullet">오야붕과 아이들</li><br />
            <li className="FooterInfo-item no-Bullet">주소 : 광주광역시 동구 제봉로 92 (대성학원 1-3층)</li><br />
            <li className="FooterInfo-item no-Bullet">상담 시간 : 평일 09:00~17:30 (토, 일요일, 공휴일 휴무)</li><br />
          </ul>
        </div>
        <div className="FooterCopy">Reference site: 청정원, Thank You</div>
      </div>
    </footer>
  )
}

export default Footer