import './charList.scss';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { Component } from 'react';

class CharList extends Component {
    
    state = {
        char: [],
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError);
        console.log('mount');
    }

    componentWillUnmount() {
        console.log('unmount')
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render() { 

    const characters = this.state.char;
        
    const elements = characters.map((item, index) => {
        const thumbClassFit = item.thumbnail.includes('available') ? 'unset' : 'cover'
        
        return (
            <li key={item.name + index} className="char__item">
                <img style={{objectFit: thumbClassFit}}src={item.thumbnail} alt=""/>
                <div className="char__name">{item.name}</div>
            </li> 
        )
    })
      
    const {loading, error} = this.state;

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? elements : null;

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {errorMessage}
                    {spinner}
                    {content}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

export default CharList;