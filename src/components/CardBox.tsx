import * as React from 'react';
import moment from 'moment';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Pagination } from "@material-ui/lab";

import CategoriesButton from './CategoriesButton';
import instance from "../api/api";
import usePagination from '../hooks/usePagination';

type Props = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  categories?: [string];
  url?: string;
  icon_url?: string;
  value?: string;
  setJoke: (event: React.MouseEvent<HTMLElement>) => void
};

const CardBox: React.FC<Props> = ({ value, icon_url, created_at, setJoke }: Props) => {
  const [search, setSearch] = React.useState();
  const [searchJokes, setSearchJokes] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [page, setPage] = React.useState(1);
  const PER_PAGE = 10;

  const count = Math.ceil(searchJokes.length / PER_PAGE);
  const _DATA = usePagination(searchJokes, PER_PAGE);

  const handleChangePage = (e: any, p: number) => {
    setPage(p);
    _DATA.jump(p);
  };

  const handleChange = (event: { target: { value: any; } }) => {
    setSearch(event.target.value);
  };

  React.useEffect(() => {
    instance.get(`/search?query=${search}`)
      .then((response) => {
        setSearchJokes(response?.data.result);
        setMessage('');
        if (!response.data.result.length) {
          setMessage('No content');
          setSearchJokes([]);
        }
      })
      .catch((error) => {
        setMessage(error.data.error);
        setSearchJokes([]);
      });
  }, [search]);

  React.useEffect(() => {
    if (!searchJokes.length) {
      setMessage('');
    }
  }, [searchJokes, setMessage]);

  return (
    <>
      <Box sx={{ maxWidth: 775, mt: 5 }}>
        <Card variant="outlined">
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" src={icon_url} />
            }
            subheader={`Created: ${moment(created_at).format('MMMM Do YYYY')}`}
          />
          <CardContent>
            <Typography variant="body2">
              {value}
              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <CategoriesButton setJoke={setJoke} />
          </CardActions>
        </Card>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 2 }}>
        <TextField
          label="Search jokes..."
          id="search"
          onChange={handleChange}
          sx={{ m: 1, width: '25ch' }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
          }}
        />
      </Box>
      <Box sx={{ maxWidth: 775, my: 5 }}>
        {_DATA.currentData().length ?
          <Pagination
            count={count}
            size="large"
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={handleChangePage}
          /> : <></>}
        {_DATA.currentData().map((joke: { id: React.Key | null | undefined; icon_url: string | undefined; created_at: moment.MomentInput; value: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
          <Card variant="outlined" key={joke.id} sx={{ mt: 1 }}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" src={joke.icon_url} />
              }
              subheader={`Created: ${moment(joke.created_at).format('MMMM Do YYYY')}`}
            />
            <CardContent>
              <Typography variant="body2">
                {joke.value}
                <br />
              </Typography>
            </CardContent>
          </Card>
        ))}
        {message &&
          <Typography variant="body2">
            {message}
          </Typography>}
      </Box>
    </>
  )
}

export default CardBox;