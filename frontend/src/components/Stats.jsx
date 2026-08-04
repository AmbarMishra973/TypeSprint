function Stats({
    wpm,
    accuracy,
    typedText
}){


return (

<div className="stats">


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

{
typeof typedText === "number"
?
typedText
:
typedText.length
}

</strong>

</div>


</div>


);


}


export default Stats;