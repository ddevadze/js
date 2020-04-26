import {urlDefault,urlTrending} from "./src.js";

class getData{
    constructor(){
        this._updateRecentSearches();
        document.getElementById("submit").addEventListener('click',()=>{this.onSubmit();});
        document.getElementById("trending").addEventListener('click',()=>{this.onTrending();});
    }
    _updateRecentSearches = () =>{
        document.getElementById('recent-searches').innerHTML = '';
        let searchList = JSON.parse(localStorage.getItem('searchList'));
        if(searchList==null){
            searchList = {added:[],default:[]};
            searchList.default = ["Rick and Morty", "Space", "Typing", "Meme's", "Internet Cats"];
        }
        localStorage.setItem('searchList', JSON.stringify(searchList));
        let counter = 0;
        loop:
        for(let a in searchList){
            for(let b in searchList[a]){
                this._addSearchItem(searchList[a][b]);
                counter++;
                if(counter>6)
                    break loop;
            }
        }
    }
    _alterRecentSearches = (index) =>{
        let searchList = JSON.parse(localStorage.getItem('searchList'));
        if(!searchList.added.includes(index)&&index!==''&&!searchList.default.includes(index)){
            searchList.added.unshift(index);
            localStorage.setItem('searchList', JSON.stringify(searchList));
        }
    }    
    onSubmit = () => {
        const index = document.getElementById("text").value;
        this._alterRecentSearches(index);
        this._updateRecentSearches();
        this._getData(index,urlDefault).then(a => this._getList(a.data));
    }
    onTrending = () => {
        this._getData('',urlTrending).then(a => this._getList(a.data));
    }
    _getData = async (index,src) =>{
            const url = src+index;
            const a = await fetch(url);
            let b = await a.json();
            return b;
        }
    _getList = (data) => {
        document.getElementById('gallery').innerHTML='';
        for(let a in data){
            this._draw(data[a].images.original.url,data[a].rating);
        }
    }
    _draw = (src,rating) =>{
        const div = document.createElement('div');
        div.className = "gallery-item";
        const img = document.createElement('img');
        img.src = src;
        div.append(img);
        const divRating = document.createElement('div');
        divRating.className='gallery-item-rating';
        divRating.innerHTML = `Rating: ${rating}`;
        div.append(divRating);
        document.getElementById('gallery').append(div);
    }
    _addSearchItem = (value) =>{
        const inputContainer = document.createElement('div');
        inputContainer.className = 'recent-search-item-container';
        const input = document.createElement('input');
        input.className = "recent-search-item";
        input.type = 'button';
        input.id = value;
        input.value = value;
        const closeLogo = document.createElement('div');
        closeLogo.className = 'recent-search-item-close';
        inputContainer.append(closeLogo);
        inputContainer.append(input);
        document.getElementById('recent-searches').prepend(inputContainer);
        closeLogo.addEventListener('click',()=>{this._close(closeLogo);});
        input.addEventListener('click',()=>{this._getData(input.value,urlDefault).then(a => this._getList(a.data));})
    }
    _close = (node) => {
        const inputVal = node.nextSibling;
        node.parentNode.parentNode.removeChild(node.parentNode);
        let searchList = JSON.parse(localStorage.getItem('searchList'));
        let deleteInd = searchList.added.indexOf(inputVal.value);
        if(deleteInd >= 0){
            searchList.added.splice(deleteInd,1);
        }else{
            deleteInd = searchList.default.indexOf(inputVal.value);
            if(deleteInd >= 0){
                searchList.default.splice(deleteInd,1);
            }
        }
        localStorage.setItem('searchList', JSON.stringify(searchList));
        this._updateRecentSearches();
    }
}

const main = new getData();