
//The lerp function is convenient for creating motion along a straight path and for drawing dotted lines
function lerp(a, b, t){
    return a + (b - a) * t;
}

//math function for figuring out the correct intersecting point multiple points
function getIntersection(A,B,C,D){ 
    const tTop=(D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop=(C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom=(D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    
    if(bottom!=0){
        const t=tTop / bottom;
        const u=uTop / bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return {
                x:lerp(A.x, B.x, t),
                y:lerp(A.y, B.y, t),
                offset:t
            }
        }
    }

    return null;
}


function polysIntersect(poly1, poly2) {

    //looping over each point in the first polygon
    for(let i = 0; i < poly1.length; i++) {

        //for each time we go over a point in the first polygon, we will check every point in the second polygon
        for(let j = 0; j < poly2.length; j++) {

            //comparing the segments between the 2 polygons
            const touched = getIntersection(
                poly1[1],
                poly1[(i + 1) % poly1.length],

                poly2[j],
                poly2[(j + 1) % poly2.length],
            )

            //returning true if the have touched
            if(touched) {
                return true
            }
        }
    }

    //if the car is safe it will return false (hasnt crashed)
    return false;
}
