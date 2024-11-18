import React, { useState } from "react";
import {
    Box,
    Typography,
    Collapse,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const FAQComponent: React.FC = () => {
    const [open, setOpen] = useState<number | null>(null);

    const toggleCollapse = (index: number) => {
        setOpen(open === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Solana Sniper Bot?",
            answer: `Solana Sniper Bot is a dApp that helps everyone, without coding experience, to have the ability of Sniping Tokens within Solana Blockchain with custom settings adapted to your needs.
                     \nSolana Sniper Bot has been designed to purchase tokens just once they are launched in the fastest way.
                     \nThis tool is completely safe, audited by different development teams and used by hundreds of Solana users every month.`,
        },
        {
            question: "What do I need to use Solana Sniper Bot?",
            answer: `To use Solana Sniper Bot, you will need the following:
                     \n1. Your wallet private key to automatically buy/sell tokens
                     \n2. Custom RPC endpoints. You can use ours for 0.25 SOL (we don’t recommend you to use free RPCs as you will have less speed than other Snipers)
                     \n3. Fund wallet provided with SOL to buy/sell tokens
                     \nTo prevent disconnection, please keep your browser tab active and avoid actions such as switching to other tabs or applications, minimizing the browser, or letting your device enter sleep mode.`,
        },
        {
            question: "Is it Safe to use Smithii Solana Sniper Bot?",
            answer: `Yes, our Solana Sniper Bot is completely safe. It is a dApp that makes the sniping for you, but we do not store or misuse your wallet. However, we suggest you create a new wallet and periodically transfer profits to your main wallet.
                     \nWe need to ask your private key because it is the only way to snipe tokens for you in an efficient way.
                     \nOur Sniper has been audited by different development teams and used by hundreds of Solana users every month.`,
        },
        {
            question: "How much does using Solana Sniper Bot Cost?",
            answer: `Using SOYO Sniper Bot on Solana costs Free for Public Endpoint and  0.05 SOL each time you run it for 48 hours of usage for our Premium Endpoint.  We don’t take any fee from your trading.
                     \nYou can also get unlimited free use of our Solana Sniper Bot, if you are interested please contact us.
                     \nYou will also need to fund your wallet with SOL to snipe the tokens and pay the Solana transaction fees.`,
        },
        {
            question: "How much money will I make using this Solana Sniper?",
            answer: `The amount of money you make sniping tokens depends on a wide variety of factors and you can’t ever control it.
                     The most relevant things that will affect the profit you generate are: 
                     \n1. RPC you use
                     \n2. Snipers going for the same tokens and their speed (mostly depends on RPC used)
                     \n3. Amount of tokens that rug
                     \n4. Amount of tokens launched with the conditions you set on filters
                     \nPlease remember that we only offer the technology that allows you to snipe tokens, but the use of Solana Sniper Bot is at your own risk, and we are not responsible for any losses incurred while using the bot. We only guarantee we will not store or steal any funds from your wallet.`,
        },
        {
            question: "I’m having some issues, please help",
            answer: `We have a good error-handling mechanism and every error should be visible in the logs tab.
                    \n* If you think the sniper bot has issues:
                    \n* There might not be many tokens launching on Solana at the moment – so just wait.
                    \n*Your configuration might be such that the bot is skipping a lot of tokens since they do not match the criteria – so just wait.
                    \n*You have been rate-limited by your RPC provider. Please check your rate limits on the Dashboard page of your RPC provider.
                    \n*A Restart button will appear after 15 minutes of bot inactivity, allowing you to unblock it at no cost if it freezes.
                    \nIf your sell transactions are failing and you can’t sell/swap the tokens, most likely the liquidity has been removed (rug pull) and since there is no liquidity, the transaction cannot be completed.

                    If you need help please contact our <a target="_blank" href="https://t.me/web3prodev">support team.</a>`,
        },
        {
            question: "How much tokens will I snipe using SOYO Sniper?",
            answer: `You can’t control the amount of tokens you will snipe. It will depend on how much new tokens are launched with the conditions you set on filters within the time you are running the Sniper.`,
        },
        {
            question: "How to get the private key of my solana wallet?",
            answer: `You will need to have a Solana Wallet created. Then you will be able to get the private key of your Solana wallet by <a target="_blank" href="https://www.youtube.com/watch?v=xS5VllDRyMc"> following these steps.</a>`,
        },
    ];

    return (
        <Box p={2}>
            <Typography variant="h6" gutterBottom>
                FAQ
            </Typography>
            <List>
                {faqs.map((faq, index) => (
                    <Box key={index} mb={2} sx={{ border: '1px solid #ddd', borderRadius: 2, overflow: 'hidden' }}>
                        <ListItem
                            onClick={() => toggleCollapse(index)}
                            component="div"
                            sx={{
                                backgroundColor: '#f9f9f9', // Background for question title
                                '&:hover': { backgroundColor: '#f0f0f0' }, // Hover effect
                                cursor: 'pointer',
                            }}
                        >
                            <ListItemText
                                primary={faq.question}
                                primaryTypographyProps={{
                                    sx: { fontWeight: 'bold', color: '#333' }, // Question text styles
                                }}
                            />
                            <IconButton edge="end" onClick={() => toggleCollapse(index)}>
                                {open === index ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </ListItem>
                        <Collapse in={open === index} timeout="auto" unmountOnExit>
                            <Box pl={4} pt={2} pb={2} sx={{ backgroundColor: '#fff' }}> {/* Answer background */}
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#555', whiteSpace: 'pre-line' }} // Styling
                                    dangerouslySetInnerHTML={{ __html: faq.answer }} // Render HTML content
                                />
                            </Box>
                        </Collapse>
                    </Box>

                ))}
            </List>
        </Box>
    );
};

export default FAQComponent;
