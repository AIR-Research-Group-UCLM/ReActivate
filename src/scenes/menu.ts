import AbstractPoseTrackerScene from '~/pose-tracker-engine/abstract-pose-tracker-scene';
import CustomButtom from '~/gameobjects/custom-button';
import Constants from '~/constants';
import { IPoseLandmark } from '~/pose-tracker-engine/types/pose-landmark.interface';
import Utils from '~/utils';
import Stats from '../modals/stats';
import WorkoutCardio from './workout-cardio';
import HUD from './hud';
import WorkoutAgility from './workout-agilidad';
import Historical from '~/modals/historical';
import WorkoutFlexibilidad from './workout-flexibility';

export default class Menu extends AbstractPoseTrackerScene {
  constructor() {
    super(Constants.SCENES.Menu);
  }

  private flexibility;
  private cardio;
  private agility;
  private tutorial;
  private buttonRanking;
  private buttonStats;
  private buttonRight;
  private buttonLeft;
  private buttonExitMarker;
  private background;
  private buttonNextHistorical;
  private buttonPreviousHistorical;
  private width: number;
  private height: number;
  private statsView: Stats;
  private historicalView: Historical;
  private titleText: Phaser.GameObjects.Text;
  private statsOn;
  private videoTutorial;
  private audioTutorial;

  private bodyPoints: any = [];
  private buttons: any[] = [];
  private touchingButton: boolean = false;

  init() {
    this.width = this.cameras.main.width;
    this.height = this.cameras.main.height;
  }

  create(): void {


    super.create();

    this.titleText = this.add.text(this.width / 2 - 120, this.height / 12, 'ReActivate', {
      fontFamily: 'Russo One',
      fontSize: '45px',
      color: '#FFFFFF',
      fontStyle: 'normal',
    });
    this.titleText.depth = 1;
    this.titleText.setVisible(false);

    this.background = this.add.image(1280, 720 / 2, "room");

    this.audioTutorial = this.sound.add(Constants.AUDIO.AUDIOTUTORIAL, { volume: 0.65, loop: false });
    this.sound.pauseOnBlur = false;


    this.flexibility = new CustomButtom(this, 250, 220, 'button', 'Flexibility');
    this.buttons.push(this.flexibility);

    this.cardio = new CustomButtom(this, 645, 220, 'button', 'Cardio');
    this.buttons.push(this.cardio);

    this.agility = new CustomButtom(this, 1042, 220, 'button', 'Agility');
    this.buttons.push(this.agility);

    this.buttonRight = new CustomButtom(this, 1220, 600, 'out', '►', 95, -48);
    this.buttons.push(this.buttonRight);

    this.buttonLeft = new CustomButtom(this, 60, 600, 'out', '◄', 95, -48);
    this.buttonLeft.setVisible(false);
    this.buttons.push(this.buttonLeft);


    this.buttonPreviousHistorical = new CustomButtom(this, 80, this.height / 2, 'out', '＜', 95, -48);
    this.buttonPreviousHistorical.setVisible(false);
    this.buttonPreviousHistorical.setEnabled(false);
    this.buttons.push(this.buttonPreviousHistorical);

    this.buttonNextHistorical = new CustomButtom(this, 1200, this.height / 2, 'out', '＞', 95, -48);
    this.buttonNextHistorical.setVisible(false);
    this.buttonNextHistorical.setEnabled(false);
    this.buttons.push(this.buttonNextHistorical);


    this.tutorial = new CustomButtom(this, 250, 220, 'button', 'Tutorial')
    this.tutorial.setVisible(false);
    this.tutorial.setEnabled(false);
    this.buttons.push(this.tutorial);

    this.buttonRanking = new CustomButtom(this, 645, 220, 'button', 'History')
    this.buttonRanking.setVisible(false);
    this.buttonRanking.setEnabled(false);
    this.buttons.push(this.buttonRanking);

    this.buttonStats = new CustomButtom(this, 1042, 220, 'button', 'Statistics')
    this.buttonStats.setVisible(false);
    this.buttonStats.setEnabled(false);
    this.buttons.push(this.buttonStats);

    this.buttonExitMarker = new CustomButtom(this, 1200, 52, 'out', 'X', 95, -48);
    this.buttonExitMarker.setVisible(false);
    this.buttonExitMarker.setEnabled(false);
    this.buttons.push(this.buttonExitMarker);


    this.buttons.forEach((button) => {
      this.add.existing(button);
      this.physics.world.enable(button);
      button.body.setAllowGravity(false);
    });

    for (var i = 0; i < 22; i++) {
      let point;
      if (i === 9) {
        point = this.physics.add.sprite(-50, -50, 'leftHand');
        point.setScale(0.35);
      } else if (i === 10) {
        point = this.physics.add.sprite(-50, -50, 'rightHand');
        point.setScale(0.35);
      } else {
        point = this.physics.add.sprite(-20, -20, 'point');
        point.setAlpha(0);
      }

      this.add.existing(point);
      this.bodyPoints.push(point);
    }


    this.buttons.forEach((button) => {
      var ipoint = 0;
      this.bodyPoints.forEach((point) => {
        ipoint++;
        if (ipoint >= 4 && ipoint <= 11)
          this.physics.add.overlap(
            button,
            point,
            () => {
              button.animateToFill(false);
              this.touchingButton = true;
              if (button.buttonIsFull() && button.isEnabled()) {
                button.emit('down', button);
              }
            },
            undefined,
            this,
          );
      });
      try {
        if (button) {
          button.setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
              button.animateToFill(true);
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
              button.animateToEmpty(true);
            })
            .on('down', () => {
              button.animateToFill(true);
              this.touchingButton = true;
              if (button.buttonIsFull() && button.isEnabled()) {
                this.menuSwitch(button);
              }
            })
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
              button.animateToFill(true);
              this.touchingButton = true;
              if (button.buttonIsFull() && button.isEnabled()) {
                this.menuSwitch(button);
              }
            });
        }
      } catch (error) {
      }
    });



    if (this.scene.get(Constants.SCENES.WorkoutCardio))
      this.scene.remove(Constants.SCENES.WorkoutCardio);
    if (this.scene.get(Constants.SCENES.WorkoutAgilidad))
      this.scene.remove(Constants.SCENES.WorkoutAgilidad);
    if (this.scene.get(Constants.SCENES.WorkoutFlexibilidad))
      this.scene.remove(Constants.SCENES.WorkoutFlexibilidad);
    if (this.scene.get(Constants.SCENES.HUD))
      this.scene.remove(Constants.SCENES.HUD);
  }

  menuSwitch(button: CustomButtom) {
    switch (button.getText()) {
      case 'Flexibility':
        this.startNewSceneWorkout(Constants.SCENES.WorkoutFlexibilidad, WorkoutFlexibilidad);
        break;
      case 'Cardio':
        this.startNewSceneWorkout(Constants.SCENES.WorkoutCardio, WorkoutCardio);
        break;
      case 'Agility':
        this.startNewSceneWorkout(Constants.SCENES.WorkoutAgilidad, WorkoutAgility);
        break;
      case 'Tutorial':
        this.videoTutorial = this.add.video(this.width / 2, this.height / 2, 'tutorial');
        this.videoTutorial.play();
        this.audioTutorial.play();
        this.buttonLeft.setVisible(false);
        this.buttonLeft.setEnabled(false);
        this.setScreen2(false);
        this.titleText.setVisible(false);
        this.buttonExitMarker.setVisible(true);
        this.buttonExitMarker.setEnabled(true);
        break;
      case 'Statistics':
        this.statsView = new Stats(this, this.width / 2, this.height / 2, "backgroundStats");
        this.buttonLeft.setVisible(false);
        this.buttonLeft.setEnabled(false);
        this.setScreen2(false);
        this.titleText.setVisible(false);
        this.buttonExitMarker.setVisible(true);
        this.buttonExitMarker.setEnabled(true);

        this.statsOn = true;
        break;
      case 'History':
        this.historicalView = new Historical(this, this.width / 2, this.height / 2, "backgroundStats");
        this.buttonLeft.setVisible(false);
        this.buttonLeft.setEnabled(false);
        this.setScreen2(false);
        this.titleText.setVisible(false);
        this.buttonExitMarker.setVisible(true);
        this.buttonExitMarker.setEnabled(true);
        this.buttonNextHistorical.setVisible(true);
        this.buttonNextHistorical.setEnabled(true);
        this.buttonPreviousHistorical.setVisible(true);
        this.buttonPreviousHistorical.setEnabled(true);

        break;
      case '►':
        if (button.isEnabled()) {
          this.tweens.add({
            targets: this.background,
            x: 0,
            duration: 3000,
            ease: 'Power2',
            completeDelay: 3000
          });

          this.buttonRight.setVisible(false);
          this.setScreen1(false);
          this.buttonLeft.setVisible(true);
          this.setScreen2(true);
        }
        break;
      case '◄':
        if (button.isEnabled()) {
          this.tweens.add({
            targets: this.background,
            x: 1280,
            duration: 3000,
            ease: 'Power2',
            completeDelay: 3000
          });

          this.setScreen2(false);
          this.buttonLeft.setVisible(false);
          this.buttonRight.setVisible(true);
          this.setScreen1(true);
          break;
        }
      case 'X':
        this.buttonExitMarker.setVisible(false);
        this.buttonExitMarker.setEnabled(false);
        this.setScreen2(true);
        this.buttonLeft.setVisible(true);
        this.buttonLeft.setEnabled(true);
        this.buttonNextHistorical.setVisible(false);
        this.buttonPreviousHistorical.setVisible(false);
        this.buttonNextHistorical.setEnabled(false);
        this.buttonPreviousHistorical.setEnabled(false);
        if (this.historicalView)
          this.historicalView.destroyHistorical();
        if (this.statsView)
          this.statsView.destroyStats();
        this.statsOn = false;
        if (this.videoTutorial && this.videoTutorial.isPlaying) {
          this.videoTutorial.destroy();
          this.audioTutorial.stop();
        }
        break;
      case '＞':
        this.historicalView.showHistorical(true);
        break;
      case '＜':
        this.historicalView.showHistorical(false);
        break;
      default:
        break;
    }
  }
  setScreen1(enable: boolean) {
    this.flexibility.setVisible(enable);
    this.cardio.setVisible(enable);
    this.agility.setVisible(enable);
    this.flexibility.setEnabled(enable);
    this.cardio.setEnabled(enable);
    this.agility.setEnabled(enable);
  }
  setScreen2(enable: boolean) {
    this.tutorial.setVisible(enable);
    this.buttonRanking.setVisible(enable);
    this.buttonStats.setVisible(enable);
    this.tutorial.setEnabled(enable);
    this.buttonRanking.setEnabled(enable);
    this.buttonStats.setEnabled(enable);
  }

  startNewSceneWorkout(scene: string, nameClass: Class) {
    this.scene.stop();
    if (!this.scene.get(scene))
      this.scene.add(scene, nameClass, false, { x: 400, y: 300 });
    if (!this.scene.get(Constants.SCENES.HUD))
      this.scene.add(Constants.SCENES.HUD, HUD, false, { x: 400, y: 300 });
    this.scene.start(scene);
    this.scene.start(Constants.SCENES.HUD);
    this.scene.bringToTop(Constants.SCENES.HUD);
  }

  movePoints(coords: IPoseLandmark[] | undefined) {
    if (this.bodyPoints && coords) {
      for (var i = 0; i < this.bodyPoints.length; i++) {
        if (i == 9 || i == 10) {
          this.bodyPoints[i].setPosition(coords[i + 11]?.x * 1280, coords[i + 11]?.y * 720);
          //this.bodyPoints[i].rotation = -1.57 - Phaser.Math.Angle.Between(coords[i].x, coords[i].y, coords[i - 4].x, coords[i - 4].y);
        }
      }
    }
  }

  update(time: number, delta: number): void {
    if (!this.touchingButton) {
      this.buttons.forEach((button) => {
        this.bodyPoints.forEach((point) => {
          if (point.body && point.body.touching.none) {
            button.animateToEmpty(false);
          }
        });
      });
    }
    if (this.statsOn) {
      this.statsView.updateAnimationStats();
      this.statsView.updateAnimationCircle();
    }
    super.update(time, delta, {
      renderElementsSettings: {
        shouldDrawFrame: false,
        shouldDrawPoseLandmarks: false,
      },
      beforePaint: (poseTrackerResults, canvasTexture) => {
        // This function will be called before refreshing the canvas texture.
        // Anything you add to the canvas texture will be rendered.
      },
      afterPaint: (poseTrackerResults) => {
        // This function will be called after refreshing the canvas texture.
        this.movePoints(poseTrackerResults.poseLandmarks ? poseTrackerResults.poseLandmarks : undefined);
      },
    });
    this.touchingButton = false;

    // Here you can do any other update related to the game.
    // PoseTrackerResults are only available in the previous callbacks, though.
  }
}
