import '../styles/responseCard.css'

export default function responseCard(props) {
    const prompt = props.prompt;
    const result = props.result;

    return (
        <div>
            <div className="responseCard">
                <div className="prompt"> <strong>Prompt:</strong> {prompt}</div><br />
                <div className="response"><strong>Response:</strong> {result}</div>
            </div>
        </div>
    )
}