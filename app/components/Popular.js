var React = require('react'); 
var PropTypes = require('prop-types');
var api = require('../utils/api')


function RepoGrid(props) {
    return(
        <ul className="popular-list">
        {props.repos.map((repo, index) => {
            return(
                <li key={repo.name} className="popular-item">
                    <div className="popular-rank">
                        #{index + 1}
                    </div>
                    <ul className="space-list-items">
                        <li>
                            <img className="avatar"
                                src={repo.owner.avatar_url}
                                alt={'Avatar for' + repo.owner.login} />
                        </li>
                        <li>
                            <a href={repo.html_url}>{repo.name}</a>
                        </li>
                        <li>
                            @{repo.owner.login}
                        </li>
                        <li>
                            {repo.stargazers_count} stars
                        </li>
                    </ul>
                </li>
            )
        })}
        </ul>
    )
}

RepoGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

function MenuItem(props) {
    return(
        <li
            style={props.language === props.selectedLanguage ? { color: '#d0021b' } : { color: 'inherit' }}
            onClick={props.onSelect.bind(null, props.language)}>
            {props.language}
        </li>
    )
}

MenuItem.propTypes = {
    language: PropTypes.string.isRequired,
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}

function SelectLanguage(props) {
    var languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
    return(
        <ul className="languages">
            {languages.map(lang => {
                return (
                    <MenuItem language={lang}
                                selectedLanguage={props.selectedLanguage}
                                onSelect={props.onSelect}
                                key={lang}/>
                )
            })}
        </ul>    
    )
}

SelectLanguage.propTypes = {
    selectedLanguage: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired

}

class Popular extends React.Component {
    constructor(props) {
        super(props),
        this.updateLanguage = this.updateLanguage.bind(this),
        this.state = {
            selectedLanguage: 'All',
            repos: null
        }
    }

    updateLanguage(lang) {
        this.setState(() => ({selectedLanguage: lang, repos: null}))

        api.fetchPopularRepos(lang)
            .then((repos) => {
               return this.setState(() => {
                    return({
                        repos: repos
                    })
                })
            })
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLanguage)
    }

    render() {
        
        return (
         <div>
            <SelectLanguage 
                selectedLanguage={this.state.selectedLanguage}
                onSelect={this.updateLanguage} />
            {!this.state.repos ? 
                <p>LOADING!</p> : 
                <RepoGrid repos={this.state.repos} />
            }
         </div>   
        )
    }
}

module.exports = Popular;