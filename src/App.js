import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ResponseCard from './components/responseCard';

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const existingResps = localStorage.getItem("responses");
    if (existingResps) setResponses(JSON.parse(existingResps));
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const data = {       
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
      
      let response = await fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(data)
      });

      let resJson = await response.json();
      if (response.status === 200) {
        let result = {
          prompt: prompt,
          result: resJson.choices[0].text
        }

        // immutable
        const newResponses = [...responses]
        newResponses.unshift(result);
        setResponses(newResponses);
        
        localStorage.setItem("responses", JSON.stringify(newResponses))
      }

    } catch (err) {
      console.log(err);
    };
  }

  return (
    <div className="App">
      <h1>Fun with AI</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalReview">
          <Form.Label column sm={2}>
              <strong>Enter prompt</strong>
          </Form.Label>
          <Col sm={8}>
              <Form.Control value={prompt} type="text" as="textarea" onChange={(e) => setPrompt(e.target.value)} placeholder="" />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" className="submitBtn">Submit</Button>
      </Form>
      <div className="responses">
        <h2>Responses</h2>
        {
          responses.map(response => {
            return <ResponseCard
                      key={response.prompt}
                      prompt={response.prompt}
                      result={response.result}/>
          })
        }
      </div>
    </div>
  );
}

export default App;
