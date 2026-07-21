import "./ParticipantCard.css";

export default function ParticipantCard({

    joined,

    index

}){

    return(

        <div className="participant-card">

            {

                joined

                ?

                "👨‍💻"

                :

                "+"

            }

        </div>

    );

}