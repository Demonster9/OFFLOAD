import "./ProgressDots.css";

export default function ProgressDots({ current, total }) {

    return (

        <div className="progress-dots">

            {

                Array.from({ length: total }).map((_, index) => (

                    <div
                        key={index}
                        className={
                            index < current
                                ? "dot active"
                                : "dot"
                        }
                    />

                ))

            }

        </div>

    );

}