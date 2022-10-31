import React, { useEffect } from "react";
import { ReactDOM } from "react";
import './App.css';
var part = "before";
var chars = [];
var seconds_left = 30;
var missed_words = new Set();
var yellowIndex = 0;
var timeIsRunning = false;
var red_num = 0;
function App() {
  const words_num = 250*3;
  var STARTING_TIME = seconds_left;
  function shuffleWords(){
    fetch(`https://random-word-api.herokuapp.com/word?number=${words_num}`)
      .then((response)=>response.json())
      .then((data)=>{
        var newWords = "";
        data.forEach(element => {
          newWords+=element;
          newWords+=" ";
        });
        newWords.slice(0,-1);
        var newChars = [];
        for(var i=0;i<newWords.length;i++){
          newChars.push(newWords[i]);
        };
        chars = (newChars);
        console.log("schuffled");
      });
  };
  function styleText(){
    console.log("styling");
    var targetDiv = document.getElementById("allChars");
    targetDiv.innerHTML = "";
    for(var i=Math.max(0,yellowIndex-40);i<yellowIndex && i<chars.length;i++){
      const newSpan = document.createElement("span");
      newSpan.className = "letter";
      newSpan.innerHTML = chars[i];
      newSpan.style.color = "green";
      newSpan.classList.add("typed");
      targetDiv.appendChild(newSpan);
    }
    if(red_num>0){
      for(var i=yellowIndex;i<yellowIndex+red_num && i<chars.length;i++){
        const newSpan = document.createElement("span");
        newSpan.className = "letter";
        newSpan.innerHTML = chars[i];
        newSpan.style.color = "red";
        newSpan.classList.add("typed");
        targetDiv.appendChild(newSpan);
      }
      for(var i=yellowIndex+red_num;i<yellowIndex+red_num+35;i++){
        const newSpan = document.createElement("span");
        newSpan.className = "letter";
        newSpan.innerHTML = chars[i];
        newSpan.style.color = "black";
        newSpan.classList.add("typed");
        if(i==yellowIndex+red_num){
          newSpan.style.textDecoration = "underline";
          newSpan.style.textDecorationColor = "red";
          newSpan.style.textDecorationThickness = "2px";
        }
        targetDiv.appendChild(newSpan);
      }
    }
    else{
      if(yellowIndex < chars.length){
        const newSpan = document.createElement("span");
        newSpan.className = "letter";
        newSpan.innerHTML = chars[yellowIndex];
        newSpan.style.color = "yellow";
        newSpan.style.textDecoration = "underline";
        newSpan.style.textDecorationColor = "white";
        newSpan.style.textDecorationThickness = "2px";
        newSpan.classList.add("typed");
        targetDiv.appendChild(newSpan);
      }
      for(var i=yellowIndex+1;i<yellowIndex+35;i++){
        const newSpan = document.createElement("span");
        newSpan.className = "letter";
        newSpan.innerHTML = chars[i];
        newSpan.style.color = "black";
        newSpan.classList.add("typed");
        targetDiv.appendChild(newSpan);
      }
    }
  }
  function processWords(words){
    var newChars = [];
    var words = Array.from(words);
    while(newChars.length<words_num){
      var rand = Math.floor(Math.random()*2);
      if(words.length==0){
        rand = 1;
      }
      if(rand==0){
        var word = words[Math.floor(Math.random()*words.length)];
        for(var i=0;i<word.length;i++){
          newChars.push(word[i]);
        }
      }
      else{
        var index = Math.floor(Math.random()*chars.length);
        while(chars[index]==" "){
          index = Math.floor(Math.random()*(chars.length-1));
        }
        while(chars[index]!=" "&&index>0){
          index--;
        }
        if(index>0)index++;
        while(chars[index]!=" "&&index<chars.length){
          newChars.push(chars[index]);
          index++;
        }
      }
      newChars.push(" ");
    }
    chars = newChars;
  }
  function handleStart(type){
    document.getElementById("allChars").innerHTML = "Loading...";
    console.log("type: "+type);
    var hiddenElements = document.getElementsByClassName("afterGame");
    for(var i=0;i<hiddenElements.length;i++){
      hiddenElements[i].style.display = "none";
    }
    if(type=="start"){
      shuffleWords();
      console.log("starting start");
      setTimeout(()=>{
        document.getElementById("startButton").style.display = "none";
        yellowIndex = 0;
        red_num = 0;
        part="during";
        console.log("handle start");
        timeIsRunning = true;
        seconds_left = STARTING_TIME;
        document.getElementById("timer").innerHTML = seconds_left;
        var interval = setInterval(function() {
          if (seconds_left <= 0)
          {
            part = "after";
            timeIsRunning = false;
            alert("Time is up!");
            endGame();
            clearInterval(interval);
            seconds_left++;
          }
          seconds_left -= 1;
          document.getElementById("timer").innerHTML = seconds_left;
        }, 1000);
        styleText();
      },1000);
    }
    else{
      if(type=="missed_words"){
        processWords(missed_words);
        missed_words.clear();
      }
      document.getElementById("startButton").style.display = "none";
      yellowIndex = 0;
      red_num = 0;
      part="during";
      console.log("handle start");
      timeIsRunning = true;
      seconds_left = STARTING_TIME;
      document.getElementById("timer").innerHTML = seconds_left;
      var interval = setInterval(function() {
        if (seconds_left <= 0)
        {
          part = "after";
          timeIsRunning = false;
          alert("Time is up!");
          endGame();
          clearInterval(interval);
          seconds_left++;
        }
        seconds_left -= 1;
        document.getElementById("timer").innerHTML = seconds_left;
      }, 1000);
      styleText();
    }
    
  }
  function endGame(){
    var hiddenElements = document.getElementsByClassName("afterGame");

    for(var i=0;i<hiddenElements.length;i++){
      hiddenElements[i].style.display = "inline";
    }
    var words_typed = yellowIndex/5;
    var wpm = words_typed/STARTING_TIME*60;
    wpm = Math.ceil(wpm);
    document.getElementById("wpm").innerHTML = "Your WPM: "+wpm;
  }
  useEffect(()=>{
    document.addEventListener("keydown", handleKeyDown, true);
  },[]);
  function addToMissedWords(index){
    var word = "";
    while(chars[index]!=" " && index!=0){
      index--;
    }
    if(index>0)index++;
    while(chars[index]!=" " && index!=chars.length-1){
      word+=chars[index];
      index++;
    }
    missed_words.add(word);
  }
  const handleKeyDown = (event) => {
    if(part!="during"){
      return;
    }
    if(event.key === "Backspace"){
      if(red_num>0){
        red_num--;
      }
      else{
        if(yellowIndex>0){
          yellowIndex--;
        }
      }
    }
    else{
      if(red_num>0){
        addToMissedWords(yellowIndex+red_num);
        red_num++;
      }
      else{
        if(chars[yellowIndex]===event.key){
          yellowIndex++;
        }
        else{
          red_num++;
          addToMissedWords(yellowIndex+red_num);
        }
      }
    }
    styleText();
  }
  function setTimer(newTime){
    if(part=="during"){
      return;
    }
    STARTING_TIME = newTime;
    seconds_left = newTime;
    document.getElementById("timer").innerHTML = STARTING_TIME;
    var TimerSwitches = document.getElementsByClassName("timeSwitch");
    for(var i=0;i<TimerSwitches.length;i++){
      TimerSwitches[i].style.color = "white";
      TimerSwitches[i].style.backgroundColor = "#323241";
    }
    document.getElementById(newTime).style.backgroundColor = "#3c3c57";
  }
  const tak = true;
  const nie = false;
  return (
    <div className="App">
      <div id="topBar">
        <div id="30" className="timeSwitch" style={{backgroundColor:"#3c3c57"}} onClick={()=>setTimer(30)}>
          30
        </div>
        <div id="60" className="timeSwitch" onClick={()=>setTimer(60)}>
          60
        </div>
        <div id="90" className="timeSwitch" onClick={()=>setTimer(90)}>
          90
        </div>
        <div id="120" className="timeSwitch" onClick={()=>setTimer(120)}>
          120
        </div>
      </div>
      <div id="main">
        { 
          (
            <div id="startButton" className="btn" onClick={()=>handleStart("start")}>start</div>
          )
        }
        <div id="timer" className="timer">
          {seconds_left}
        </div>
        <div id="allChars" className="allChars">
          {
            chars.map((char, i)=>{
              return (<div key={i} className={i+" "+"letter"}>{char}</div>)
            })
          }
          </div>
          <div id="wpm" className="afterGame" style={{display: "none"}}>wpm</div>
          <div>try again:</div>
          <div style={{width: "100%", display: "flex", alignItems:"center", justifyContent:"center"}}>
            <div className="afterGame btn" style={{display : "none"}} onClick={()=>handleStart("start")}>
              new words
            </div>
            <div className="afterGame btn" style={{display: "none"}} onClick={()=>handleStart("missed_words")}>
              practice misspelled words 
            </div>
            <div className="afterGame btn" style={{display: "none"}} onClick={()=>handleStart("same words")}>
              same words
            </div>
          </div>
        </div>
      </div>
  );
}
export default App;
