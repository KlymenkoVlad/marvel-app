import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';

const ComicsList = () => {

    const [comicList, setComicList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [comicEnded, setComicEnded] = useState(false)

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicListLoaded)
    }

    const onComicListLoaded = (newComicList) => {
        let ended = false;
        if (newComicList.length < 8) {
            ended = true;
        }

        setComicList(comicList => {
            const uniqueComics = newComicList.filter(newChar => 
              !comicList.some(char => char.id === newChar.id)
            );
          
            return [...comicList, ...uniqueComics];
          });
          

        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 8)
        setComicEnded(comicEnded => ended)
    }

    function renderItems(arr) {
        const items = arr.map(item => {
            
            return (
                <li key={item.id} className="comics__item">
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })
        
        return(
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const comics = renderItems(comicList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">                    
            {errorMessage}
            {spinner}
            {comics}
            <button className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': comicEnded ? 'none' : 'block'}}
            onClick={() => onRequest(offset)}>
            <div className="inner">load more</div>
        </button>
    </div>
    )
}

export default ComicsList;