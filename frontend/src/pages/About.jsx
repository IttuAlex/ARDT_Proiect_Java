import React from "react";
import "./About.css";

const aboutText = `Se zice că MAZI s-a născut când cineva din Comănești a întrebat: „Da’ n-avem și noi o cafea care să ne trezească până la Bacău?” /
Universul a zis „Ține-mi ceșcuța” și a vărsat din greșeală un sac de boabe fix în mijlocul orașului. A doua zi, în loc de groapă, era o cafenea. /
Primul espresso MAZI a fost atât de tare încât Wi-Fi-ul a prins viteză fără să fie instalat și un vecin a zis „Bă, cred că mi s-a updatat viața.” /
La început veneau doi-trei oameni „doar să vadă”, acum vin la MAZI ca la încărcat de suflet și baterie: 1% la telefon, 300% la chef de viață. /
MAZI nu e doar o cafenea în Comănești, e locul unde chiar și luni dimineața se uită în jur și zice: „Ok, hai, parcă mai merge încă o zi."/ CU SIGURANTA ACEST TEXT NU A FOST REALIZAT CU AI.`;

export default function About() {
  const lines = aboutText.split("/");

  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>
        {lines.map((line, index) => (
          <React.Fragment key={index}>
            {line.trim()}
            {index !== lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
