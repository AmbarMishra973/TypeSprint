function Stats({

    wpm,

    rawWpm,

    accuracy,

    characters,

    errors

}){


return (

<div className="stats">



<div>

Raw WPM:

<strong>

{rawWpm}

</strong>

</div>





<div>

WPM:

<strong>

{wpm}

</strong>

</div>





<div>

Accuracy:

<strong>

{accuracy}%

</strong>

</div>





<div>

Characters:

<strong>

{characters}

</strong>

</div>





<div>

Errors:

<strong>

{errors}

</strong>

</div>




</div>

);


}


export default Stats;