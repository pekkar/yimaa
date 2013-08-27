function out = yimaaMeasurements(BW,G,ls,lh)
% function for feature extraction from image G based on binary mask BW
% out = fluffyMeasurements(BW,G)

% 11.11.2009 (C) Pekka Ruusuvuori

if nargin < 3
    ls = 19;
end
if nargin < 4
    lh = 39;
end

ds = 1;
texfl = 19;
G = double(G);
CC = bwconncomp(BW);
num = CC.NumObjects;
stats = regionprops(CC,G,'Solidity','MinorAxisLength','MajorAxisLength','EquivDiameter','Extent','Area','ConvexArea','MeanIntensity','Perimeter');
statsc = regionprops(CC,G,'Centroid'); % supporting information
centroidvec = [statsc.Centroid];
centroids(:,1) = centroidvec(1:2:end);
centroids(:,2) = centroidvec(2:2:end);
fields = fieldnames(stats);



features = [];
for strind = 1:length(fields)
    feature = cat(1, stats.(fields{strind}));
    features = [features, feature];
end

featureCO = [];
edges = [];
F = [];

E = edge(medfilt2(G,[7 7]));
for objind = 1:num % measurements per object
    % graylevel co-occurrence
    GLCM = graycomatrix(uint8(G(CC.PixelIdxList{objind})),'Offset',[-5 0]);
    statsCO = graycoprops(GLCM);
    fieldsCO = fieldnames(statsCO);
    for strind = 1:length(fieldsCO)
        featureCO(objind,strind) = statsCO.(fieldsCO{strind});
    end
    

    tmp = double(G(BW==1));
    
    % histogram
    histo(1) = std(double(G(CC.PixelIdxList{objind})));
    histo(2) = iqr(double(G(CC.PixelIdxList{objind})));
    histo(3) = skewness(double(G(CC.PixelIdxList{objind})));
    histo(4) = kurtosis(double(G(CC.PixelIdxList{objind})));
    samplingvec = [1:3:100];
    histo(:,size(histo,2)+1:size(histo,2)+length(samplingvec)) = prctile(tmp(:),samplingvec);

    
    % edges
    edges(objind,1) = sum(E(CC.PixelIdxList{objind}));    
    mask = zeros(size(E));
    mask(round(centroids(objind,2)),round(centroids(objind,1))) = 1;
    [DM] = bwdist(mask);
    mask = logical(DM<stats(objind).EquivDiameter/4);
    Emasked = E.*mask;
    edges(objind,2) = sum(Emasked(CC.PixelIdxList{objind}));
    
    CCE = bwconncomp(E);
    numEPixels = cellfun(@numel,CCE.PixelIdxList);
    edges(objind,3) = mean(numEPixels);
    edges(objind,4) = std(numEPixels);
    edges(objind,5) = length(numEPixels);


    % signature
    bbound =  bwboundaries(BW);
    dbound(:,1) = bbound{1}(:,1)- centroids(1,2);
    dbound(:,2) = bbound{1}(:,2)- centroids(1,1);
    dsig = sqrt(dbound(:,1).^2 + dbound(:,2).^2);
    signat(1) = mean(dsig);
    signat(2) = std(dsig);
    signat(3) = iqr(dsig);
    signat(4) = sum(abs(dsig-mean(dsig)));
    signat(5) = prctile(dsig,10);
    signat(6) = prctile(dsig,90);

    
    % inner structure
    [BWI,resid] = yimaaInnerSegm(double(G(1:ds:end,1:ds:end)),single(BW(1:ds:end,1:ds:end)),ls,lh,1);
    inner(objind,1) = sum(sum(BWI))/stats(1).Area;
    inner(objind,2) = sum(sum(BWI.*mask(1:ds:end,1:ds:end)))/stats(objind).Area;
    inner(objind,3) = (inner(1)-inner(2));%/stats(objind).Area;
    
    CCI = bwconncomp((~BWI).*mask(1:ds:end,1:ds:end),8);
    numPixels = cellfun(@numel,CCI.PixelIdxList);
    inner(objind,4) = mean(numPixels);
    inner(objind,5) = std(numPixels);
    inner(objind,6) = length(numPixels);
    inner(objind,7) = resid(1);
    inner(objind,8) = resid(2);
    inner(objind,9) = resid(3);
    inner(objind,10) = resid(4);
    
    
    if sum(sum(~BWI.*mask(1:ds:end,1:ds:end))) ==0
        summa = 0
        dfbcval = 0;
        dfbcs = 0;
        bp = 0;
        ep = 0;
        numPixelsSkeleton = 0;
        CCBSKEL.NumObjects = 0;
    else
        [nbc, rbc] = boxcount(BWI,'slope'); drawnow
        dfbc = -diff(log(nbc))./diff(log(rbc));
        dfbcval = mean(dfbc(1:5));
        dfbcs = std(dfbc(1:5));
        
        BSKEL = bwmorph(~BWI.*mask(1:ds:end,1:ds:end),'skel',Inf);
        BP = bwmorph(BSKEL,'branchpoints');
        bp = sum(sum(BP));
        EP = bwmorph(BSKEL,'endpoints');
        ep = sum(sum(EP));
        CCBSKEL = bwconncomp(BSKEL);
        numPixelsSkeleton = cellfun(@numel,CCBSKEL.PixelIdxList);
    end
    
    inner(objind,11) = CCBSKEL.NumObjects;
    inner(objind,12) = bp;
    inner(objind,13) = ep;
    inner(objind,14) = dfbcval;
    inner(objind,15) = dfbcs;
    inner(objind,16) = mean(numPixelsSkeleton);
    inner(objind,17) = max(numPixelsSkeleton);

    
    % texture
    J = entropyfilt(uint8(G(1:ds:size(G,1),1:ds:size(G,2))),imcircle(texfl));
    texfeat(objind,1) = mean(J(BW(1:ds:size(BW,1),1:ds:size(BW,2))>0));
    texfeat(objind,2) = std(J(BW(1:ds:size(BW,1),1:ds:size(BW,2))>0));
    J = stdfilt(uint8(G(1:ds:size(G,1),1:ds:size(G,2))),imcircle(texfl));
    texfeat(objind,3) = mean(J(BW(1:ds:size(BW,1),1:ds:size(BW,2))>0));
    texfeat(objind,4) = std(J(BW(1:ds:size(BW,1),1:ds:size(BW,2))>0));
    

    %%% from get_features (icpr)
    % LPF
    G = double(G);
    filtsize = [5 11 19 27 35];
    for ind = 1:length(filtsize)
        H1 = fspecial('gaussian',filtsize(ind),filtsize(ind));
        GH1 = imfilter(G,H1,'same');
        tmph = G-GH1;
        rd(ind) = mean(tmph(BW==1));
        %rds(ind) = std(tmph(BW==1));
        %imshow(GH1,[])
        %drawnow
    end
    F(:,size(F,2)+1:size(F,2)+length(rd)) = rd;
    %F(:,size(F,2)+1:size(F,2)+length(rds)) = rds;
    
    
    H1=lbp((G.*BW),1,8);
    F(:,size(F,2)+1:size(F,2)+length(H1)) = H1(2,:);

    hogFeat = HOG(G);
    F(:,size(F,2)+1:size(F,2)+length(hogFeat)) = hogFeat;

    %%% end taken from get_features (icpr)
    
    
end
if num > 0
    allfeatures = [features, featureCO, edges, inner, texfeat, histo, signat, F];
    %allcentroids = [allcentroids; centroids];
    %allfeatures = [allfeatures; edges]
    fieldsEdge = {'edgePixels';'edgePixelsCentre';'meanEdgeLength';'stdEdgeLength';'numEdges'};
    fieldsInner = {'inArea';'inCenterArea';'inBorderArea';'meanInSize';'stdInSize';'numInObj';'meanLPResid';'stdLPResid';'meanLP2Resid';...
        'stdLP2Resid';'innerObj';'innerBrachPoints';'innerEndPoints';'boxCountDfval';'boxCountDfS';'innerSkeletonMeanLength';'innerSkeletonMaxLength'};
    fieldsTex = {'meanEntropy';'stdEntropy';'meanStd';'stdStd'};
    fieldsHisto = {'stdInt';'iqrInt';'skewnessInt';'kurtosisInt'};
    for indF = 1:length(samplingvec)
        fieldsHisto{end+1} = ['Percentile ' num2str(samplingvec(indF))];
    end
    fieldsSignat = {'meanSig';'stdSig';'iqrSig';'absdiffSig';'signPrc10Int';'signPrc90Int'};
    featnamesF = {};
    for indF = 1:length(filtsize)
        featnamesF{end+1,1} = ['Lowpass ' num2str(filtsize(indF))];
    end
    featnamesLBP = {};
    for indLBP = 1:length(H1)
        featnamesLBP{end+1,1} = ['LBP ' num2str(indLBP)];
    end
    featnamesHOG = {};
    for ind = 1:length(hogFeat)
        featnamesHOG{end+1,1} = ['HOG ' num2str(ind)];
    end
    fields = [fields;fieldsCO;fieldsEdge;fieldsInner;fieldsTex;fieldsHisto;fieldsSignat;featnamesF;featnamesLBP;featnamesHOG];
else
    % this should not happen
    allfeatures = [];
    fields = {};
    BWI = [];
end

out.features = allfeatures;
out.fields = fields;
out.bwi = BWI;


% save([basedir 'fields.mat'],'fields');
% save([basedir 'allfeatures.txt'],'allfeatures','-ascii');
% save([basedir 'allcentroids.txt'],'allcentroids','-ascii');
