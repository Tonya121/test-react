import * as React from "react";
import Container from '@mui/material/Container';

import instance from "../api/api";
import CardBox from "../components/CardBox";

interface Jokes {
  id: string;
  created_at: string;
  updated_at: string;
  categories: [string];
  url: string;
  icon_url: string;
  value: string;
}

const Main: React.FC = () => {
  const [joke, setJoke] = React.useState({});
  const [error, setError]: [string, (error: string) => void] = React.useState(
    ''
  );

  const fetchData = React.useCallback(() => {
    instance.get<Jokes[]>(`/random`)
      .then((response) => {
        localStorage.setItem("jokes", JSON.stringify(response?.data));
        setJoke(response?.data)
      })
      .catch((error) => {
        setError(error);
      });
  }, [setError]);

  React.useEffect(() => {
    const jokes = localStorage.getItem("jokes");
    if (jokes) return;
    fetchData();
  }, [fetchData]);

  React.useEffect(() => {
    window.addEventListener('storage', () => {
      const jokes = localStorage.getItem("jokes");
      const jokeParse = jokes ? JSON.parse(jokes) : null;
      setJoke(jokeParse)
    });
  }, []);

  return (
    <Container maxWidth="sm">
      {joke ? <CardBox {...joke} setJoke={setJoke} /> : <></>}
      {error && <p>{error}</p>}
    </Container>
  )
}
export default Main;