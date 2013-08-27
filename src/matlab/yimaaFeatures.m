

% read images
imagePath = '';  % pointer to image repository
D = dir([imagePath 'IMG*.jpg']);  % change to match image naming convention

features = [];  % !!
out = [];
hp = 2;
wp = 2;
for ind = 1:length(D)
    imname = [imagePath D(ind).name];
    I = imread(imname);
    
    subplot(hp,wp,1)
    %set(gca,'Position',[.05 .66 frac frac])
    I = I(:,:,2);
    imshow(I)
    hold on
    
    
    % segment
    [BW,th] = yimaaSegm(I,'graythresh',.95);    
    if sum(sum(BW))==0
    else
        BW = bwselect(BW,size(BW,2)/2,size(BW,1)/2,8);
        subplot(hp,wp,2)
        imshow(BW)
        drawnow
    end    
    if sum(sum(BW)) == 0
    else
        % calculate features
        stat = regionprops(BW,'BoundingBox');
        bb = round(stat.BoundingBox);
        out = yimaaMeasurements(BW(bb(2):bb(2)+bb(4),bb(1):bb(1)+bb(3)),I(bb(2):bb(2)+bb(4),bb(1):bb(1)+bb(3)),19,23); % was: 11,15
        subplot(hp,wp,3)
        imshow(out.bwi)
        drawnow
        features(ind,:) = out.features;%[features; out.features];
    end
    save tmpfeatures.mat features out
    disp(ind)
end
features(sum(features,2)==0,:) = [];

%%%%%%%
% build data matrix & class vector here...
%
%%%%%%%
% analyze data
%%%%%%%


% normalize data
colmean = mean(features,1);
features = features - repmat(colmean,size(features,1),1);
colstd = std(features,[],1);
features = features./repmat(colstd,size(features,1),1);
features(isnan(features)) = 0;

% [coef,score] = pca(features);
% figure, hold on
% plot3(score(ct==0,1),score(ct==0,2),score(ct==0,3),'b*')
% plot3(score(ct==1,1),score(ct==1,2),score(ct==1,3),'g+')

% logreg classification: NOTE! Requires pmtk3 toolkit
origPath = pwd;
addpath 'pmtk3-2april2011/'  % set this to pmtk3 toolkit, developed with ver 02April2011
initPmtk3

% cross validation
k = round(length(ct)/4);
scorr = 0;
sall = 0;
warning off
loopcount = 5000;
for ind = 1:loopcount
    yHat = [];
    p = [];
    lo = [];
    rind = 1;
    while rind <= k
        rn = randint(1,1,[1 length(ct)]);
        if ~ismember(rn,lo)
            lo(rind) = rn;
            rind = rind + 1;
        end
    end
    
    test = features(lo,:);
    train = features;
    train(lo,:) = [];
    ctrain = ct;
    ctrain(lo) = [];
    model = logregFitPathCv(train, ctrain, 'regType', 'l1');
    W(ind,:) = model.w';
    % Testing
    [yHat(:,1),p(:,1)] = logregPredict(model, test);
    Y(ind,:) = (yHat==ct(lo))';
    P(ind,:) = p';
    disp([ind sum(yHat==ct(lo))/length(yHat)]);
    scorr = scorr + sum(yHat==ct(lo));
    sall = sall + length(yHat);
    numfeat(ind) = sum(model.w~=0);
    featinds{ind} = find(model.w~=0);
end
warning on
cd(origPath);


figure,
subplot(211)
hist(sum(Y,2)/k,0.5:0.013:1)
axis tight
title('Distribution of prediction accuracy in 5000 cross validation loops')
xlabel('Prediction accuracy')
ylabel('Count')
subplot(212)
hist(P(:),0:0.013:1)
axis tight
title('Probability distributions in 5000 cross validation loops')
xlabel('P(fluffy)')
ylabel('Count')

%avg_acc = mean(sum(Y,2)/k)

% get the features which get selected
selections = sum(W(:,2:end)~=0);
[sortsel,selID] = sort(selections,2,'descend');
sortsel = sortsel(sortsel>0);
selID = selID(sortsel>0);
plot(sortsel)
figure
subplot(211)
stemh = stem(selections(selID),'filled');
axis([.5 length(selID)+.5 0 5000])
ylabel('Count')
set(stemh,'MarkerFaceColor',[.9 .9 .9],'MarkerEdgeColor',[.1 .1 .9],'LineWidth',2,'Marker','o','MarkerSize',9)
set(gca,'XTickLabel','')
%set(gca,'XTickLabel',fields(selID))
%rotateXLabels(gca,90)
%figure
subplot(212)
boxplot(W(:,selID+1),fields(selID),'plotstyle','compact')
ylabel('Weight')

% clustergram for selected features
clustergram(features(:,selID)', 'RowLabels',fields(selID),'Cluster','column')


%% plot two of them...
% plot histograms
fnum = selID(1);  % 19 = inArea, 29 = meanEntropy
hstep = .8;
tmp = features(:,fnum);
h1 = hist(tmp(1:151),[min(tmp):hstep:max(tmp)]); axis tight
h2 = hist(tmp(152:end),[min(tmp):hstep:max(tmp)]); axis tight

figure
subplot(211)
stairs(h1,'Color',[.2 .8 .2],'LineWidth',2)
hold on
stairs(h2,'Color',[.6 .6 .6],'LineWidth',2)
title(fields{fnum})
legend({'Fluffy','Non-fluffy'})


fnum = selID(2);  % 19 = inArea, 29 = meanEntropy
hstep = .12;
tmp = features(:,fnum);
h1 = hist(tmp(1:151),[min(tmp):hstep:max(tmp)]); axis tight
h2 = hist(tmp(152:end),[min(tmp):hstep:max(tmp)]); axis tight

subplot(212)
stairs(h1,'Color',[.2 .8 .2],'LineWidth',2)
hold on
stairs(h2,'Color',[.6 .6 .6],'LineWidth',2)
title(fields{fnum})
legend({'Fluffy','Non-fluffy'})
