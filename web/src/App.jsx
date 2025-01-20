import React, { useEffect, useRef, useState } from 'react';
import Companies from './components/companies/Companies'
import CompanyInput from './components/company-input/CompanyInput'
import PlayerJob from './components/playerjob/PlayerJob'

import Post from './components/post/Post'
import CreatePost from './components/create-post/CreatePost'

import "./App.css";
const devMode = !window.invokeNative;

const App = () => {
    const [isDarkMode, setDarkMode] = useState(true);
    const [AppPage, setAppPage] = useState("overview");
    const [transitioning, setTransitioning] = useState(false);

    const [company, setCompany] = useState(-1);
    const [companies, setCompanies] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [postImage, setPostImage] = useState("");

    const [currentJob, setCurrentJob] = useState("");
    const [currentGrade, setCurrentGrade] = useState("");
    const [playerJobs, setPlayerJobs] = useState([]);
    const [playerAdmin, setPlayerAdmin] = useState(true);

    const appDiv = useRef(null);
    const { fetchNui, getSettings, selectGallery, onSettingsChange } = window;

    const updateCompany = (newCompanyValue) => {
        setTransitioning(true);

        setTimeout(() => {
            setCompany(newCompanyValue);
            setTransitioning(false);
        }, 300);
    };

    const enterCreatingPost = () => {
        if (selectGallery) {
            selectGallery({
                includeVideos: false,
                includeImages: true,
                cb: (data) => {
                    setPostImage(data.src);
                    setIsCreatingPost(true);
                }
            });
        }

        if (!selectGallery) {
            setPostImage("https://cdn.discordapp.com/attachments/997878598180544573/1197185746604408912/file.png");
            setIsCreatingPost(true);
        }
    };

    useEffect(() => {
        if (devMode) {
            document.getElementsByTagName("html")[0].style.visibility = "visible";
            document.getElementsByTagName("body")[0].style.visibility = "visible";
            return;
        }

        const setupSettings = async () => {
            if (devMode) return;

            getSettings().then((settings) => setDarkMode(settings.display.theme === "dark"));
            onSettingsChange((settings) => setDarkMode(settings.display.theme === "dark"));
        };

        const setupPosts = async () => {
            if (devMode) return;

            let newPosts = await fetchNui("setupPosts", {});
            setPosts(newPosts);
        }

        const setupCompanies = async () => {
            if (devMode) return;

            let newCompanies = await fetchNui("setupApp", {});
            setCompanies(newCompanies);
        }

        const setUserOverview = async () => {
            if (devMode) return;

            let overview = await fetchNui("setupOverview", {});
            setCurrentJob(overview.name);
            setCurrentGrade(overview.grade);
            setPlayerJobs(overview.jobs);
            setPlayerAdmin(overview.admin);
        }

        setupSettings();
        setupPosts();
        setupCompanies();
        setUserOverview();

        window.addEventListener("message", async (event) => {
            switch (event.data.action) {
                case "refreshCompanies":
                    setCompanies(event.data.companies);
                    break;
                case "refreshUser":
                    setCurrentJob(event.data.name);
                    setCurrentGrade(event.data.grade);
                    setPlayerJobs(event.data.jobs);
                    setPlayerAdmin(event.data.admin);
                    break;
                case "refreshPosts":
                    setPosts(event.data.posts);
                    break;
                default:
                    break;
            }
        });

        return () => {
            setCompanies([]);
            setPosts([]);
            setPlayerJobs([]);
            setPlayerAdmin(false);
        }
    }, [fetchNui, getSettings, onSettingsChange]);

    return (
        <AppProvider>
            <div className={`app ${isDarkMode ? "dark" : "light"}`} ref={appDiv}>
                
                <div className={`app-content ${transitioning ? "transitioning" : ""}`}>
                    { AppPage === "poster" &&
                        <>
                            <h1 className="headline">Firma Opslag</h1>

                            { isCreatingPost === false &&
                                <>
                                    { playerAdmin === true &&
                                        <div className="create-button">
                                            <button onClick={() => enterCreatingPost()} className='create-post'><i className="fa-solid fa-plus"></i> Opret opslag</button>
                                        </div>
                                    }
                                    <div className={`company-posts ${isDarkMode ? "dark" : "light"}`}>
                                        {posts.map((company, index) => (
                                            <Post key={index} index={index} company={company} />
                                        ))}
                                    </div>
                                </>
                            }

                            { isCreatingPost === true &&
                                <>
                                    <div className="create-button">
                                        <button onClick={() => setIsCreatingPost(false)} className='create-post'><i className="fa-solid fa-backward-step"></i> Gå tilbage</button>
                                    </div>
                                    <div className="company-create-post">
                                        <CreatePost darkMode={isDarkMode} image={postImage} setIsCreatingPost={setIsCreatingPost} />
                                    </div>
                                </>
                            }
                        </>
                    }

                    { AppPage === "companies" &&
                        <>
                            { companies[company] !== undefined 
                                ?
                                <>
                                    <CompanyInput darkMode={isDarkMode} company={companies[company]} updateCompany={updateCompany} />
                                </>
                                :
                                <>
                                    <h1 className="headline">Firmaer</h1>
                                    <Companies darkMode={isDarkMode} companies={companies} updateCompany={updateCompany} />
                                </>
                            }
                        </>
                    }

                    { AppPage === "overview" &&
                        <>
                            <h1 className="headline">Oversigt</h1>
                            <div className="user-overview">
                                <div className="user-overview-container">
                                    <h3>{ currentJob }</h3>
                                    <h3>{ currentGrade }</h3>
                                </div>
                            </div>
                            <div className={`player-jobs`}>
                                {playerJobs.map((job, index) => (
                                    <PlayerJob key={index} darkMode={isDarkMode} index={index} job={job} />
                                ))}
                            </div>
                        </>
                    }
                </div>

                <div className="footer">
                    <button onClick={() => {
                        setTransitioning(true);

                        setTimeout(() => {
                            setAppPage("poster");
                            setTransitioning(false);
                        }, 300);
                    }}>opslag</button>

                    <button onClick={() => {
                        setTransitioning(true);

                        setTimeout(() => {
                            setAppPage("companies");
                            setTransitioning(false);
                        }, 300);
                    }}>oversigt</button>
                    
                    <button onClick={() => {
                        setTransitioning(true);

                        setTimeout(() => {
                            setAppPage("overview");
                            setTransitioning(false);
                        }, 300);
                    }}>dine jobs</button>
                </div>
            </div>
        </AppProvider>
    );
};

const AppProvider = ({ children }) => {
    if (devMode) {
        return <div className='dev-wrapper'>{children}</div>;
    } else return children;
};

export default App;
