import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import {Link} from 'react-router-dom';
const styles = {
    card: {
        border: "0",
        marginBottom: "30px",
        marginTop: "30px",
        borderRadius: "6px",
        color: "rgba(0, 0, 0, 0.87)",
        background: "#ffffff",
        //width: "350px",
        boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.14)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minWidth: "0",
        wordWrap: "break-word",
        fontSize: ".875rem",
        height: "300px",
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 10,
    },
    pos: {
        marginBottom: 12,
    },
    media: {
        height: 0,
        paddingTop: '60%', // 16:9
    },
    headerCard:{
        fontSize : '1.5em'
    },
};


function SimpleCard(props) {
    const { classes } = props;
    const title = props.titleCard;
    const imagen = props.content;
    const to = props.to;
    return (
        <div>
            <Card className={classes.card}>
                <CardHeader
                    classes={{
                        title: classes.headerCard,
                    }}
                     title={title}
                     titletitle={title}Style={{'fontSize':'20px', 'fontWeight':'bold'}}
                />
                <CardContent>
                </CardContent>
                <CardMedia className={classes.media}
                    image={imagen}

                    component={Link}
                    to ={to}
                />
            </Card>
        </div>
    );
}

SimpleCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);