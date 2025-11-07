import Portfolio from "../models/portfolio.js";
import User from "../models/user.js";

const createPortfolio = async (req, res) => {
    try {
        const {title, description, githubLink, demoLink} = req.body;
        if (!title || !description || !githubLink || !demoLink) {
            return res.status(401).json({message: "These fields are required"});
        }
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({message: "Unauthorized"});
        }
        const portfolio = new Portfolio({
            title,
            description,
            githubLink,
            demoLink,
            user: userId
        });
        const savedPortfolio = await portfolio.save();
        if (savedPortfolio) {
            return res.status(200).json({savedPortfolio, message: "Portfolio created successfully"});
        } else {
            return res.status(404).json({message: "Portfolio not found"});
        }      
    } catch (error) {
        console.log(`Error in createPortfolio controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const addAssets = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const portfolio = await Portfolio.findOne({_id: id, user: userId});
        if (!portfolio) {
            return res.status(401).json({message: "Unauthorized"});
        }

        const {assets} = req.body;
        if (!assets) {
            return res.status(401).json({message: "Assets are required"});
        }
        portfolio.assets = [...portfolio.assets, ...assets];
        const updatedPortfolio = await portfolio.save();
        if (updatedPortfolio) {
            return res.status(200).json({updatedPortfolio, message: "Assets added successfully"});
        } else {
            return res.status(404).json({message: "Portfolio not found"});
        }
    } catch (error) {
        console.log(`Error in addAssets controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updatePortfolio = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const {title, description, githubLink, demoLink} = req.body;

        const portfolio = await Portfolio.findOne({_id: id, user: userId});
        if (!portfolio) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (title) portfolio.title = title;
        if (description) portfolio.description = description;
        if (githubLink) portfolio.githubLink = githubLink;
        if (demoLink) portfolio.demoLink = demoLink;
        const updatedPortfolio = await portfolio.save();
        if (updatedPortfolio) {
            return res.status(200).json({updatedPortfolio, message: "Portfolio updated successfully"});
        } else {
            return res.status(404).json({message: "Portfolio not found"});
        }
    } catch (error) {
        console.log(`Error in updatePortfolio controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getPortfolio = async (req, res) => {
    try {
        const userId = req.user.userId;
        const portfolio = await Portfolio.findOne({ user: userId});
        if (!portfolio) {
            return res.status(401).json({message: "Unauthorized"});
        }
        return res.status(200).json({portfolio, message: "Portfolio found successfully"});
    } catch (error) {
        console.log(`Error in getPortfolio controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getAllPortfolios = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }
        const portfolios = await Portfolio.find().populate("user").sort({createdAt: -1});
        if (!portfolios) {
            return res.status(401).json({message: "Unauthorized"});
        }
        if (portfolios) {
            return res.status(200).json({portfolios, message: "Portfolios fetched successfully"});
        } else {
            return res.status(404).json({message: "Portfolios not found"});
        }
    } catch (error) {
        console.log(`Error in getAllPortfolios controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

const deleteportfolio = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user && user.role !== 'admin') {
            return res.status(401).json({message: "Unauthorized"});
        }

        const id = req.params.id;
        const portfolio = await Portfolio.findById(id);
        if (!portfolio) {
            return res.status(401).json({message: "Unauthorized"});
        }

        await Portfolio.findByIdAndDelete(id);

        return res.status(200).json({message: "Portfolio deleted successfully"});
    } catch (error) {
        console.log(`Error in deletePortfolio controller: ${error}`);
        return res.status(500).json({message: "Internal server error"});
    }
}

export {
    createPortfolio,
    addAssets,
    updatePortfolio,
    getPortfolio,
    getAllPortfolios,
    deleteportfolio
}