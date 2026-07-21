export default function Countdown({ seconds }) {

    const minutes = Math.floor(seconds / 60);

    const remaining = seconds % 60;

    return (

        <div className="countdown">

            <h1>

                {String(minutes).padStart(2, "0")}

                :

                {String(remaining).padStart(2, "0")}

            </h1>

        </div>

    );

}